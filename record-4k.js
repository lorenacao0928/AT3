// Records Companion Feed in portrait 4K (2160×3840).
// Phone fills the full screen; no outer desktop chrome; no backdrop-filter blur.

const { chromium } = require('playwright');
const { execSync }  = require('child_process');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const FFMPEG      = path.join(__dirname, 'node_modules/ffmpeg-static/ffmpeg');
const PW_BROWSERS = '/opt/pw-browsers';
const PORT        = 3801;
const DURATION_MS = 85000;          // full animation + buffer
const VIDEO_DIR   = path.join(__dirname, '_video_4k');
const OUTPUT_MP4  = path.join(__dirname, 'companion-feed-4k-60fps.mp4');

// Portrait 4K: 2160 wide × 3840 tall  (= 4K rotated, standard UHD portrait)
// deviceScaleFactor 2 → browser renders at 4320×7680, then we scale down to 2160×3840
// Actually let's use viewport 1080×1920 at dpr:2 → native 2160×3840.
const VW = 1080;
const VH = 1920;
const DPR = 2;   // → physical 2160×3840

function startServer() {
  const mime = {
    '.html':'text/html', '.js':'application/javascript',
    '.css':'text/css', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
    '.png':'image/png', '.svg':'image/svg+xml',
  };
  const server = http.createServer((req, res) => {
    const fp = path.join(__dirname, decodeURIComponent(req.url.split('?')[0]));
    fs.readFile(fp, (err, data) => {
      if (err) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': mime[path.extname(fp)] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise(r => server.listen(PORT, () => r(server)));
}

async function main() {
  // Build the recording-optimised HTML
  require('./build-record-html.js');

  console.log('Starting server…');
  const server = await startServer();
  if (!fs.existsSync(VIDEO_DIR)) fs.mkdirSync(VIDEO_DIR);

  process.env.PLAYWRIGHT_BROWSERS_PATH = PW_BROWSERS;

  const browser = await chromium.launch({
    headless: false,
    executablePath: `${PW_BROWSERS}/chromium-1194/chrome-linux/chrome`,
    args: [
      '--no-sandbox', '--disable-setuid-sandbox',
      '--use-gl=swiftshader', '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist', '--enable-accelerated-2d-canvas',
      '--force-device-scale-factor=' + DPR,
    ],
  });

  const context = await browser.newContext({
    viewport: { width: VW, height: VH },
    deviceScaleFactor: DPR,
    recordVideo: { dir: VIDEO_DIR, size: { width: VW * DPR, height: VH * DPR } },
  });

  // Route CDN to local packages
  const localMap = {
    'unpkg.com/react@18.3.1/umd/react.development.js':
      path.join(__dirname, 'node_modules/react/umd/react.development.js'),
    'unpkg.com/react-dom@18.3.1/umd/react-dom.development.js':
      path.join(__dirname, 'node_modules/react-dom/umd/react-dom.development.js'),
    'unpkg.com/@babel/standalone@7.29.0/babel.min.js':
      path.join(__dirname, 'node_modules/@babel/standalone/babel.min.js'),
  };
  await context.route('**/*', async (route) => {
    const url = route.request().url();
    const key = Object.keys(localMap).find(k => url.includes(k));
    if (key) {
      await route.fulfill({ status:200, contentType:'application/javascript',
        body: fs.readFileSync(localMap[key]) });
      return;
    }
    if (url.startsWith('https://') && !url.includes('localhost')) {
      await route.fulfill({ status:200, contentType:'text/plain', body:'' });
      return;
    }
    await route.continue();
  });

  const page = await context.newPage();
  page.on('pageerror', e => console.error('[ERR]', e.message));

  console.log('Loading page…');
  await page.goto(`http://localhost:${PORT}/_record.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#root > div', { timeout: 15000 });

  // Give the layout patch script time to run
  await page.waitForTimeout(600);
  console.log(`Recording ${DURATION_MS/1000}s at ${VW*DPR}×${VH*DPR}…`);
  await page.waitForTimeout(DURATION_MS);

  const webmPath = await page.video().path();
  await context.close();
  await browser.close();
  server.close();
  await new Promise(r => setTimeout(r, 1500));

  const webm = webmPath || fs.readdirSync(VIDEO_DIR)
    .filter(f => f.endsWith('.webm'))
    .map(f => path.join(VIDEO_DIR, f))
    .sort((a,b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];

  console.log(`WebM: ${(fs.statSync(webm).size/1024/1024).toFixed(1)} MB → encoding to MP4…`);

  // Encode: scale to 2160×3840, interpolate 25→60fps, high quality
  // minterpolate mi_mode=mci: motion-compensated interpolation (smooth & accurate)
  // scene=0: disable scene-cut detection so fades stay smooth
  execSync(
    `"${FFMPEG}" -y -i "${webm}" ` +
    `-vf "scale=2160:3840:flags=lanczos,` +
         `minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:scd=0" ` +
    `-c:v libx264 -preset slow -crf 10 -pix_fmt yuv420p ` +
    `-profile:v high -level:v 5.2 ` +
    `"${OUTPUT_MP4}"`,
    { stdio: 'inherit' }
  );

  fs.rmSync(VIDEO_DIR, { recursive: true, force: true });
  const mb = (fs.statSync(OUTPUT_MP4).size/1024/1024).toFixed(1);
  console.log(`\n✓  ${OUTPUT_MP4}  (${mb} MB)`);
}

main().catch(e => { console.error(e); process.exit(1); });
