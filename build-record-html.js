// Generates _record.html: phone content fills the full viewport,
// no outer desktop chrome, backdrop-filter replaced with solid fills.
const fs   = require('fs');
const path = require('path');

let src = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// ── 1. Inline local CDN scripts (already done in record.js via route intercept,
//        but we also patch here so the file is self-contained if needed).

// ── 2. Remove backdrop-filter everywhere (VP8 renders it blurry/slow).
//    Replace with equivalent opaque-ish solid backgrounds.
src = src.replace(/backdrop-filter:[^;'"]+;?\s*/g, '');
src = src.replace(/-webkit-backdrop-filter:[^;'"]+;?\s*/g, '');

// Fix cards that relied on backdrop-filter for their frosted look:
// dream-card: was rgba(255,251,244,0.72) → make fully opaque
src = src.replace('--cream-card: rgba(255,251,244,0.72);', '--cream-card: rgb(253,249,243);');
// dream-card-soft: was rgba(255,250,242,0.5)
src = src.replace('background: rgba(255,250,242,0.5);', 'background: rgb(254,251,244);');

// ── 3. Add a <style> block that makes the App fill the full viewport
//    instead of centering a 375×812 phone inside a desktop layout.
const overrideCSS = `
<style id="record-override">
  /* Recording mode: phone content fills 100% of viewport */
  html, body { background: #2a1f1a !important; overflow: hidden; }

  /* Hide the desktop chrome that wraps the phone */
  #record-outer-nav { display: none !important; }

  /* Make the phone frame fill the viewport */
  #record-phone {
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    background: #2a1f1a !important;
  }
</style>`;
src = src.replace('</head>', overrideCSS + '\n</head>');

// ── 4. Patch the App JSX so the outer container + arrows/dots are hidden,
//    and the phone fills the screen.

// Add id="record-outer-nav" to the fixed buttons and bottom controls,
// and id="record-phone" to the phone frame div.
// We do this by patching known strings in the JSX.

// Mark the left/right arrows wrapper and bottom controls as record-outer-nav:
// The nav buttons use position:fixed so we target by injecting a wrapping div.
// Simpler: inject a CSS class onto the outermost wrapper div via a tiny script.
const patchScript = `
<script>
  // After React renders, hide outer chrome for recording
  const _hideOuter = () => {
    const root = document.getElementById('root');
    if (!root || !root.firstChild) { setTimeout(_hideOuter, 50); return; }
    const outer = root.firstChild;
    // Make outer wrapper transparent background
    outer.style.background = '#2a1f1a';
    outer.style.padding = '0';

    // Find all fixed-position elements (arrows, play btn, bottom bar) and hide
    Array.from(document.querySelectorAll('[style*="position: fixed"]')).forEach(el => {
      el.style.display = 'none';
    });

    // Find the phone frame (width:375px) and scale it to fill the viewport
    const phone = Array.from(document.querySelectorAll('[style*="width: 375"]'))[0]
                || Array.from(document.querySelectorAll('[style*="width:375"]'))[0];
    if (phone) {
      const scaleX = window.innerWidth  / 375;
      const scaleY = window.innerHeight / 812;
      const scale  = Math.min(scaleX, scaleY);
      phone.style.transform       = \`scale(\${scale})\`;
      phone.style.transformOrigin = 'top left';
      phone.style.position        = 'absolute';
      phone.style.top  = \`\${(window.innerHeight - 812 * scale) / 2}px\`;
      phone.style.left = \`\${(window.innerWidth  - 375 * scale) / 2}px\`;
      phone.style.borderRadius = '0';
      phone.style.boxShadow    = 'none';
    }
  };
  window.addEventListener('load', () => setTimeout(_hideOuter, 300));
</script>`;
src = src.replace('</body>', patchScript + '\n</body>');

const out = path.join(__dirname, '_record.html');
fs.writeFileSync(out, src);
console.log('Wrote', out, `(${(fs.statSync(out).size/1024).toFixed(0)} KB)`);
