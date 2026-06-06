// Captures correct scene screenshots using keyboard navigation (ArrowRight)
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PW_BROWSERS = '/opt/pw-browsers';
const PORT = 3802;
const OUT_DIR = path.join(__dirname, '_scene_screenshots');

// How long to wait inside each scene before screenshotting (let animations settle)
const SCENES = [
  { id: 'intro',    label: '01-Intro',      waitMs: 2500 },
  { id: 'lock',     label: '02-LockScreen', waitMs: 5000 },
  { id: 'app',      label: '03-AppHome',    waitMs: 3500 },
  { id: 'memories', label: '04-Memories',   waitMs: 3500 },
  { id: 'chat',     label: '05-Chat',       waitMs: 9000 },
  { id: 'feed',     label: '06-SocialFeed', waitMs: 7000 },
  { id: 'news',     label: '07-News',       waitMs: 4000 },
  { id: 'final',    label: '08-Final',      waitMs: 11000 },
];

function startServer() {
  const mime = { '.html':'text/html','.js':'application/javascript','.css':'text/css',
    '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml' };
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

const localMap = {
  'unpkg.com/react@18.3.1/umd/react.development.js':
    path.join(__dirname, 'node_modules/react/umd/react.development.js'),
  'unpkg.com/react-dom@18.3.1/umd/react-dom.development.js':
    path.join(__dirname, 'node_modules/react-dom/umd/react-dom.development.js'),
  'unpkg.com/@babel/standalone@7.29.0/babel.min.js':
    path.join(__dirname, 'node_modules/@babel/standalone/babel.min.js'),
};

async function main() {
  require('./build-record-html.js');
  const server = await startServer();
  if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR);

  process.env.PLAYWRIGHT_BROWSERS_PATH = PW_BROWSERS;

  const browser = await chromium.launch({
    headless: false,
    executablePath: `${PW_BROWSERS}/chromium-1194/chrome-linux/chrome`,
    args: ['--no-sandbox','--disable-setuid-sandbox','--use-gl=swiftshader',
      '--enable-unsafe-swiftshader','--ignore-gpu-blocklist',
      '--force-device-scale-factor=2'],
  });

  // Phone viewport 375×812 at DPR 2 → 750×1624 physical pixels
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
  });

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

  await page.goto(`http://localhost:${PORT}/_record.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#root > div', { timeout: 15000 });
  await page.waitForTimeout(500);

  // Screenshot each scene by pressing ArrowRight to navigate forward
  for (let i = 0; i < SCENES.length; i++) {
    const scene = SCENES[i];

    if (i > 0) {
      // Navigate to next scene
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(400); // let scene transition complete
    }

    console.log(`Waiting ${scene.waitMs}ms for scene ${scene.label}…`);
    await page.waitForTimeout(scene.waitMs);

    const outPath = path.join(OUT_DIR, `${scene.label}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`  → saved ${outPath}`);
  }

  await browser.close();
  server.close();
  console.log(`\nAll ${SCENES.length} scenes saved to ${OUT_DIR}/`);
}

main().catch(e => { console.error(e); process.exit(1); });
