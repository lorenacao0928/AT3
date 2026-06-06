// Captures a high-res PNG screenshot of each scene
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PW_BROWSERS = '/opt/pw-browsers';
const PORT = 3802;
const OUT_DIR = path.join(__dirname, '_scene_screenshots');

const SCENES = [
  { id: 'intro',    label: '01-Intro',    elapsed: 2000  },
  { id: 'lock',     label: '02-LockScreen', elapsed: 9500  },
  { id: 'app',      label: '03-AppHome',  elapsed: 18000 },
  { id: 'memories', label: '04-Memories', elapsed: 24000 },
  { id: 'chat',     label: '05-Chat',     elapsed: 34500 },
  { id: 'feed',     label: '06-SocialFeed', elapsed: 48000 },
  { id: 'news',     label: '07-News',     elapsed: 58000 },
  { id: 'final',    label: '08-Final',    elapsed: 73000 },
];

const SCENE_TIMINGS = {
  intro: 5000, lock: 7500, app: 7500, memories: 6500,
  chat: 11500, feed: 14500, news: 9500, final: 17000
};

function getSceneStart(id) {
  const order = ['intro','lock','app','memories','chat','feed','news','final'];
  let t = 0;
  for (const s of order) {
    if (s === id) return t;
    t += SCENE_TIMINGS[s];
  }
  return t;
}

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
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

  process.env.PLAYWRIGHT_BROWSERS_PATH = PW_BROWSERS;

  const browser = await chromium.launch({
    headless: false,
    executablePath: `${PW_BROWSERS}/chromium-1194/chrome-linux/chrome`,
    args: ['--no-sandbox','--disable-setuid-sandbox','--use-gl=swiftshader',
      '--enable-unsafe-swiftshader','--ignore-gpu-blocklist',
      '--force-device-scale-factor=2'],
  });

  // Phone viewport: 375×812 at DPR 2 → 750×1624 physical pixels
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

  // Inject a function to jump to a specific elapsed time
  await page.evaluate(() => {
    window.__setElapsed = (ms) => {
      // Find React's internal fiber to set state — instead, we use a global flag
      window.__targetElapsed = ms;
    };
  });

  for (const scene of SCENES) {
    const target = scene.elapsed;
    console.log(`Capturing ${scene.label} (elapsed=${target}ms)…`);

    // Reload and inject elapsed override via localStorage trick
    // Better: navigate fresh and override the timer
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#root > div', { timeout: 15000 });

    // Override Date.now to fast-forward the animation timer
    await page.addInitScript(`
      const _start = Date.now();
      const _offset = ${target};
      const _orig = Date.now.bind(Date);
      Date.now = () => _orig() - _start + _offset + _start;
    `);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#root > div', { timeout: 15000 });
    await page.waitForTimeout(1200); // let animations settle

    const outPath = path.join(OUT_DIR, `${scene.label}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`  → saved ${outPath}`);
  }

  await browser.close();
  server.close();
  console.log(`\nAll scenes saved to ${OUT_DIR}/`);
}

main().catch(e => { console.error(e); process.exit(1); });
