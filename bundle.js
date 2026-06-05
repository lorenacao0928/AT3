// Creates a self-contained HTML file with all scripts inlined (no CDN needed)
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const reactJS    = fs.readFileSync(path.join(__dirname, 'node_modules/react/umd/react.development.js'), 'utf8');
const reactDomJS = fs.readFileSync(path.join(__dirname, 'node_modules/react-dom/umd/react-dom.development.js'), 'utf8');
const babelJS    = fs.readFileSync(path.join(__dirname, 'node_modules/@babel/standalone/babel.js'), 'utf8');

// Inline images as base64
function inlineImg(imgPath) {
  try {
    const abs = path.join(__dirname, imgPath);
    const data = fs.readFileSync(abs);
    return 'data:image/jpeg;base64,' + data.toString('base64');
  } catch { return imgPath; }
}

let out = html;

// Remove Google Fonts link (fall back to system fonts; update CSS)
out = out.replace(/<link rel="preconnect"[^>]*>\n?/g, '');
out = out.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/g, '');
// Add local font fallbacks in CSS
out = out.replace(
  "font-family: 'Inter', -apple-system, sans-serif;",
  "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;"
);
out = out.replace(/font-family: 'Inter'[^;]*;/g, "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;");
// Serif fallback
out = out.replace(/font-family: 'Instrument Serif'[^;)"]*/g, "font-family: Georgia");
out = out.replace(/"Instrument Serif", serif/g, 'Georgia, serif');
out = out.replace(/"Instrument Serif", 'Times New Roman', serif/g, 'Georgia, "Times New Roman", serif');
out = out.replace(/"'Instrument Serif', serif"/g, "'Georgia, serif'");
out = out.replace(/"'Instrument Serif', 'Times New Roman', serif"/g, "'Georgia, serif'");
// Mono fallback
out = out.replace(/font-family: 'JetBrains Mono'[^;]*/g, 'font-family: ui-monospace, monospace');
out = out.replace(/"'JetBrains Mono', monospace"/g, "'ui-monospace, monospace'");

// Replace CDN scripts with inline versions
out = out.replace(
  /<script src="https:\/\/unpkg\.com\/react@[^"]*"[^>]*><\/script>/,
  `<script>${reactJS}</script>`
);
out = out.replace(
  /<script src="https:\/\/unpkg\.com\/react-dom@[^"]*"[^>]*><\/script>/,
  `<script>${reactDomJS}</script>`
);
out = out.replace(
  /<script src="https:\/\/unpkg\.com\/@babel\/standalone@[^"]*"[^>]*><\/script>/,
  `<script>${babelJS}</script>`
);

// Inline images
out = out.replace(/uploads\/IMG_9603\.jpg/g, inlineImg('uploads/IMG_9603.jpg'));
out = out.replace(/uploads\/IMG_9604\.jpg/g, inlineImg('uploads/IMG_9604.jpg'));
out = out.replace(/uploads\/IMG_9607\.jpg/g, inlineImg('uploads/IMG_9607.jpg'));

const outPath = path.join(__dirname, '_bundled.html');
fs.writeFileSync(outPath, out);
console.log(`Wrote ${outPath} (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(1)} MB)`);
