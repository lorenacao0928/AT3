// Paste this entire script into:
// Figma → Plugins → Development → Open Console → paste & Enter
//
// It creates a new page "Companion Feed (Dream)" with 8 phone frames,
// each filled with the corresponding scene screenshot from GitHub.

const SCENES = [
  { name: '01 · Intro',       url: 'https://raw.githubusercontent.com/lorenacao0928/AT3/upload-video/_scene_screenshots/01-Intro.png' },
  { name: '02 · Lock Screen', url: 'https://raw.githubusercontent.com/lorenacao0928/AT3/upload-video/_scene_screenshots/02-LockScreen.png' },
  { name: '03 · App Home',    url: 'https://raw.githubusercontent.com/lorenacao0928/AT3/upload-video/_scene_screenshots/03-AppHome.png' },
  { name: '04 · Memories',    url: 'https://raw.githubusercontent.com/lorenacao0928/AT3/upload-video/_scene_screenshots/04-Memories.png' },
  { name: '05 · Chat',        url: 'https://raw.githubusercontent.com/lorenacao0928/AT3/upload-video/_scene_screenshots/05-Chat.png' },
  { name: '06 · Social Feed', url: 'https://raw.githubusercontent.com/lorenacao0928/AT3/upload-video/_scene_screenshots/06-SocialFeed.png' },
  { name: '07 · News',        url: 'https://raw.githubusercontent.com/lorenacao0928/AT3/upload-video/_scene_screenshots/07-News.png' },
  { name: '08 · Final',       url: 'https://raw.githubusercontent.com/lorenacao0928/AT3/upload-video/_scene_screenshots/08-Final.png' },
];

const W = 375, H = 812, GAP = 60;

(async () => {
  // Create a dedicated page
  const page = figma.createPage();
  page.name = 'Companion Feed (Dream)';
  figma.currentPage = page;

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });

  for (let i = 0; i < SCENES.length; i++) {
    const scene = SCENES[i];
    const x = i * (W + GAP);

    // Phone frame
    const frame = figma.createFrame();
    frame.name = scene.name;
    frame.resize(W, H);
    frame.x = x;
    frame.y = 0;
    frame.cornerRadius = 0;
    frame.clipsContent = true;

    // Load image from GitHub and set as fill
    try {
      const img = await figma.createImageAsync(scene.url);
      frame.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: img.hash }];
    } catch (e) {
      // Fallback: warm cream background if image fails
      frame.fills = [{ type: 'SOLID', color: { r: 0.961, g: 0.878, b: 0.831 } }];
      const errText = figma.createText();
      errText.characters = 'Image load failed';
      errText.fontSize = 14;
      errText.x = 10; errText.y = 10;
      frame.appendChild(errText);
    }

    // Label below frame
    const label = figma.createText();
    label.characters = scene.name;
    label.fontSize = 13;
    label.fontName = { family: 'Inter', style: 'Medium' };
    label.fills = [{ type: 'SOLID', color: { r: 0.227, g: 0.173, b: 0.141 } }];
    label.x = x;
    label.y = H + 16;
    page.appendChild(label);

    console.log(`✓ ${scene.name}`);
  }

  // Zoom to fit all frames
  figma.viewport.scrollAndZoomIntoView(page.children);
  figma.closePlugin(`✓ Created ${SCENES.length} frames in "Companion Feed (Dream)" page`);
})();
