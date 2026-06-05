// Records the Companion Feed animation to MP4.
// Uses Playwright + local CDN intercept (no public network needed).

const { chromium } = require('playwright');
const { execSync } = require('child_process');
const http = require('http');
const fs   = require('fs');
const path = require('path');

const FFMPEG       = path.join(__dirname, 'node_modules/ffmpeg-static/ffmpeg');
const PW_BROWSERS  = '/opt/pw-browsers';
const PORT         = 3800;
const DURATION_MS  = 82000;
const VIDEO_DIR    = path.join(__dirname, '_video_tmp');
const OUTPUT_MP4   = path.join(__dirname, 'companion-feed-dream-4k.mp4');
const WIDTH        = 3840;
const HEIGHT       = 2160;

// ── Static file server ────────────────────────────────────────────────
function startServer() {
  const mime = { '.html':'text/html','.js':'application/javascript','.css':'text/css',
    '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml' };
  const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, decodeURIComponent(req.url.split('?')[0]));
    const ext = path.extname(filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise(resolve => server.listen(PORT, () => resolve(server)));
}

async function main() {
  console.log('Starting local server…');
  const server = await startServer();
  if (!fs.existsSync(VIDEO_DIR)) fs.mkdirSync(VIDEO_DIR);

  process.env.PLAYWRIGHT_BROWSERS_PATH = PW_BROWSERS;

  const browser = await chromium.launch({
    headless: false,
    executablePath: `${PW_BROWSERS}/chromium-1194/chrome-linux/chrome`,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-gl=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
      '--enable-accelerated-2d-canvas',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    recordVideo: { dir: VIDEO_DIR, size: { width: WIDTH, height: HEIGHT } },
    deviceScaleFactor: 3,
  });

  // ── Intercept CDN requests and serve from node_modules ───────────────
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
    const matchKey = Object.keys(localMap).find(k => url.includes(k));
    if (matchKey) {
      const body = fs.readFileSync(localMap[matchKey]);
      await route.fulfill({ status: 200, contentType: 'application/javascript', body });
      return;
    }
    // Block external CDN (fonts etc.) — fall through to page's fallback fonts
    if (url.startsWith('https://fonts.') || url.startsWith('https://') && !url.includes('localhost')) {
      await route.fulfill({ status: 200, contentType: 'text/plain', body: '' });
      return;
    }
    await route.continue();
  });

  const page = await context.newPage();

  // Forward console errors for debugging
  page.on('console', msg => { if (msg.type() === 'error') console.error('[PAGE]', msg.text()); });
  page.on('pageerror', e => console.error('[PAGE ERROR]', e.message));

  console.log(`Navigating to page…`);
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });

  // Wait for React to render
  await page.waitForSelector('#root > div', { timeout: 15000 });
  console.log(`React rendered. Recording ${DURATION_MS / 1000}s of animation…`);

  await page.waitForTimeout(DURATION_MS);

  const videoPath = await page.video().path();
  await context.close();
  await browser.close();
  server.close();

  await new Promise(r => setTimeout(r, 1500));

  const webmFile = videoPath || fs.readdirSync(VIDEO_DIR)
    .filter(f => f.endsWith('.webm'))
    .map(f => path.join(VIDEO_DIR, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];

  if (!webmFile || !fs.existsSync(webmFile)) throw new Error('WebM not found');

  const webmSizeMB = (fs.statSync(webmFile).size / 1024 / 1024).toFixed(1);
  console.log(`WebM: ${webmFile} (${webmSizeMB} MB) — converting to MP4…`);

  execSync(
    `"${FFMPEG}" -y -i "${webmFile}" ` +
    `-vf "scale=${WIDTH}:${HEIGHT}:flags=lanczos" ` +
    `-c:v libx264 -preset slow -crf 12 -pix_fmt yuv420p ` +
    `-profile:v high -level:v 5.1 ` +
    `"${OUTPUT_MP4}"`,
    { stdio: 'inherit' }
  );

  fs.rmSync(VIDEO_DIR, { recursive: true, force: true });

  const mp4Size = (fs.statSync(OUTPUT_MP4).size / 1024 / 1024).toFixed(1);
  console.log(`\n✓ Saved: ${OUTPUT_MP4}  (${mp4Size} MB)`);
}

main().catch(err => { console.error(err); process.exit(1); });
