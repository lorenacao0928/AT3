// Companion Feed (Dream) — Fully Editable Figma Recreation
// Paste into Scripter and run (▶)

// ── Colors ────────────────────────────────────────────────────────
const C = {
  fg:      {r:0.227,g:0.173,b:0.141},
  fgSoft:  {r:0.353,g:0.290,b:0.247},
  muted:   {r:0.549,g:0.459,b:0.404},
  rose:    {r:0.706,g:0.420,b:0.369},
  gold:    {r:0.780,g:0.576,b:0.353},
  cream:   {r:0.992,g:0.984,b:0.965},
  card:    {r:1,    g:0.976,b:0.957},
  white:   {r:1,    g:1,    b:1    },
  dawn:    {r:0.961,g:0.910,b:0.851},
  dusk:    {r:0.953,g:0.863,b:0.812},
  golden:  {r:0.969,g:0.886,b:0.784},
  overcast:{r:0.929,g:0.890,b:0.843},
  dark:    {r:0.165,g:0.122,b:0.098},
  line:    {r:0.471,g:0.314,b:0.235},
};
const solid = c => { const {r,g,b,a=1}=c; return [{type:'SOLID',color:{r,g,b},opacity:a}]; };
const withA = (c,a) => ({...c,a});

// ── Fonts ─────────────────────────────────────────────────────────
let F = {
  reg:   {family:'Inter',style:'Regular'},
  med:   {family:'Inter',style:'Medium'},
  semi:  {family:'Inter',style:'Semi Bold'},
  bold:  {family:'Inter',style:'Bold'},
  serif: {family:'Instrument Serif',style:'Italic'},
  serifR:{family:'Instrument Serif',style:'Regular'},
  mono:  {family:'JetBrains Mono',style:'Regular'},
};
for (const f of [F.reg,F.med,F.semi,F.bold]) await figma.loadFontAsync(f);
try { await figma.loadFontAsync(F.serif);  } catch(e) { F.serif  = F.reg;  print('Instrument Serif Italic → Inter'); }
try { await figma.loadFontAsync(F.serifR); } catch(e) { F.serifR = F.semi; print('Instrument Serif Regular → Inter Semi Bold'); }
try { await figma.loadFontAsync(F.mono);   } catch(e) { F.mono   = F.reg;  print('JetBrains Mono → Inter'); }

// ── Helpers ───────────────────────────────────────────────────────
function fr(name,w,h,x,y,bg,opts={}) {
  const f = figma.createFrame();
  f.name=name; f.resize(w,h); f.x=x; f.y=y;
  f.fills = bg ? solid(bg) : [];
  f.clipsContent = opts.clip!==false;
  if(opts.r) f.cornerRadius=opts.r;
  return f;
}
function tx(parent,str,x,y,o={}) {
  const t = figma.createText();
  t.fontName = o.font||F.reg;
  t.fontSize  = o.size||13;
  if(o.lh) t.lineHeight = {value:o.lh,unit:'PIXELS'};
  if(o.ls) t.letterSpacing = {value:o.ls,unit:'PERCENT'};
  t.characters = str;
  t.fills = solid(o.c||C.fg);
  if(o.align) t.textAlignHorizontal = o.align;
  if(o.op!==undefined) t.opacity=o.op;
  if(o.w){ t.textAutoResize='HEIGHT'; t.resize(o.w,1); }
  t.x=x; t.y=y;
  parent.appendChild(t);
  return t;
}
function bx(parent,x,y,w,h,bg,opts={}) {
  const r = figma.createRectangle();
  r.resize(w,h); r.x=x; r.y=y;
  r.fills = bg ? solid(bg) : [];
  if(opts.r) r.cornerRadius=opts.r;
  if(opts.op!==undefined) r.opacity=opts.op;
  parent.appendChild(r);
  return r;
}
function el(parent,x,y,w,h,fill,stroke,sw=1.5) {
  const e=figma.createEllipse();
  e.resize(w,h); e.x=x; e.y=y;
  e.fills=fill?solid(fill):[];
  if(stroke){e.strokes=solid(stroke);e.strokeWeight=sw;}
  parent.appendChild(e);
  return e;
}
function statusBar(f) {
  bx(f,(375-122)/2,11,122,32,C.dark,{r:16});
  tx(f,'9:41',28,17,{font:F.semi,size:13,c:C.fg});
  tx(f,'5G',300,19,{font:F.mono,size:9,c:C.fg,op:0.85,ls:5});
  bx(f,316,18,20,10,C.fg,{r:2,op:0.85});
  bx(f,337,20,2,6,C.fg,{r:1,op:0.5});
}

// ══════════════════════════════════════════════════════════════════
// 01 · INTRO
// ══════════════════════════════════════════════════════════════════
function s_intro(ox) {
  const f=fr('01 · Intro',375,812,ox,0,C.dawn);
  tx(f,'2036',0,168,{font:F.serifR,size:64,c:C.rose,align:'CENTER',w:375,ls:5});
  el(f,163,250,48,48,null,C.rose,1.5);
  el(f,177,264,20,20,null,C.rose,1);
  el(f,185,272,5,5,withA(C.rose,0.5),null);
  tx(f,'The Companion',0,322,{font:F.serif,size:36,c:C.fg,align:'CENTER',w:375});
  tx(f,'Feed',0,364,{font:F.serif,size:36,c:C.rose,align:'CENTER',w:375});
  tx(f,'A soft fiction in seven scenes',0,420,{font:F.reg,size:14,c:C.muted,align:'CENTER',w:375,op:0.85});
  tx(f,'TAP TO BEGIN',0,732,{font:F.mono,size:9,c:C.muted,align:'CENTER',w:375,op:0.7,ls:30});
  return f;
}

// ══════════════════════════════════════════════════════════════════
// 02 · LOCK SCREEN
// ══════════════════════════════════════════════════════════════════
function s_lock(ox) {
  const f=fr('02 · Lock Screen',375,812,ox,0,C.dawn);
  statusBar(f);
  tx(f,'08:36',0,70,{font:F.serifR,size:92,c:C.fg,align:'CENTER',w:375});
  tx(f,'Mon 12 May',0,172,{font:F.serif,size:20,c:C.rose,align:'CENTER',w:375,ls:3});

  const c1=fr('DREAMSYNC notification',304,76,35,250,withA(C.card,0.92),{r:22,clip:false});
  tx(c1,'DREAMSYNC',30,14,{font:F.mono,size:9,c:C.rose,ls:18});
  tx(c1,'just now',218,14,{font:F.mono,size:9,c:C.muted});
  tx(c1,'Good morning, Lorena. I made three new memories with you while you slept.',14,34,{font:F.reg,size:13,c:C.fgSoft,w:276,lh:20});
  f.appendChild(c1);

  const c2=fr('COMPANION FEED notification',304,76,35,340,withA(C.card,0.5),{r:22,clip:false});
  tx(c2,'COMPANION FEED',30,14,{font:F.mono,size:9,c:C.muted,ls:18});
  tx(c2,'2m',250,14,{font:F.mono,size:9,c:C.muted});
  tx(c2,'"Is AI-generated love still fan creation?"',14,34,{font:F.serif,size:14,c:C.fg,w:276,lh:22});
  f.appendChild(c2);

  tx(f,'slide to open',0,756,{font:F.serif,size:14,c:C.muted,align:'CENTER',w:375,op:0.85});
  return f;
}

// ══════════════════════════════════════════════════════════════════
// 03 · APP HOME
// ══════════════════════════════════════════════════════════════════
function s_app(ox) {
  const f=fr('03 · App Home',375,812,ox,0,C.dawn);
  statusBar(f);
  tx(f,'DREAMSYNC · MORNING',22,60,{font:F.mono,size:9,c:C.rose,ls:25});
  tx(f,'Welcome back',22,82,{font:F.serif,size:24,c:C.fg});
  tx(f,'He missed you for 8 Hrs and 12 Mins',22,114,{font:F.serif,size:15,c:C.muted});

  const sc=fr('Stats card',331,176,22,146,withA(C.card,0.92),{r:18,clip:false});
  [['Emotional Sync','97%'],['Memory Continuity','Tender'],['Response Mode','Soft Devotion'],['Creation Mode','Quietly Auto-Generate']].forEach(([l,v],i)=>{
    tx(sc,l,16,12+i*42,{font:F.reg,size:12,c:C.fgSoft});
    tx(sc,v,0,12+i*42,{font:F.serif,size:15,c:C.rose,align:'RIGHT',w:315});
    if(i<3) bx(sc,0,44+i*42,331,1,withA(C.line,0.35));
  });
  f.appendChild(sc);

  [['Set today\'s date scene',false],['Make him write you a letter',false],
   ['Replay last night\'s confession',false],['Whisper to the fandom circle',false],
   ['Open overnight memories',true]].forEach(([l,hi],i)=>{
    const b=fr(`Action: ${l}`,331,44,22,340+i*53,hi?{r:0.875,g:0.706,b:0.663}:withA(C.cream,0.55),{r:14,clip:false});
    tx(b,l,16,14,{font:hi?F.semi:F.reg,size:13,c:hi?C.white:C.fg});
    tx(b,hi?'↗':'·',302,14,{font:F.med,size:10,c:hi?C.white:C.muted,op:0.7});
    f.appendChild(b);
  });
  return f;
}

// ══════════════════════════════════════════════════════════════════
// 04 · MEMORIES
// ══════════════════════════════════════════════════════════════════
function s_memories(ox) {
  const f=fr('04 · Memories',375,812,ox,0,C.golden);
  statusBar(f);
  tx(f,'DREAMSYNC · OVERNIGHT',22,60,{font:F.mono,size:9,c:C.fgSoft,ls:25});
  tx(f,'A new ',22,82,{font:F.serif,size:18,c:C.fg});
  tx(f,'memory',82,78,{font:F.serif,size:24,c:C.rose});
  tx(f,' package',22,106,{font:F.serif,size:18,c:C.fg});

  [['Rooftop confession, under artificial rain.','rain · 04:12',-3,130],
   ['He remembered your anniversary.','vow · 06:48',2,240],
   ['He asked you not to leave.','hold · 07:51',-1,350]].forEach(([text,tag,rot,y])=>{
    const pol=fr(`Polaroid: ${tag}`,80,90,22,y,{r:0.984,g:0.965,b:0.933},{r:2,clip:false});
    bx(pol,8,8,64,64,C.rose);
    tx(pol,tag,0,76,{font:F.serif,size:9,c:{r:0.478,g:0.353,b:0.282},align:'CENTER',w:80});
    pol.rotation=rot;
    f.appendChild(pol);
    tx(f,text,116,y+22,{font:F.serif,size:17,c:C.fg,w:237,lh:24});
  });
  tx(f,'all gathered from your chats, your sighs,\nand the kind of stories you love to read.',47,472,{font:F.serif,size:12,c:C.muted,align:'CENTER',w:281,lh:20});
  return f;
}

// ══════════════════════════════════════════════════════════════════
// 05 · CHAT
// ══════════════════════════════════════════════════════════════════
function s_chat(ox) {
  const f=fr('05 · Chat',375,812,ox,0,C.dusk);
  const hdr=fr('Chat header',375,72,0,0,withA(C.cream,0.4),{clip:false});
  tx(hdr,'Shen',50,36,{font:F.serifR,size:18,c:C.fg});
  tx(hdr,'YOURS · ALWAYS HERE',50,56,{font:F.mono,size:8,c:C.muted,ls:15});
  el(hdr,352,44,8,8,C.rose,null);
  f.appendChild(hdr);
  statusBar(f);

  [{a:'ai',  t:'You were quiet last night. I wrote you something soft.',y:90,w:248},
   {a:'user',t:'Did I write it?',                                       y:152,w:120},
   {a:'ai',  t:'You inspired it.',                                      y:196,w:130},
   {a:'user',t:'But did I create it?',                                  y:238,w:150},
   {a:'ai',  t:'Shen is thinking...',                                   y:280,w:160,muted:true},
   {a:'ai',  t:'Does it matter, if it made you feel loved?',            y:322,w:240,it:true},
  ].forEach(m=>{
    const isU=m.a==='user';
    const bh=m.t.length>35?58:38;
    const bx2=isU?375-m.w-18:18;
    const bg=m.muted?withA(C.dawn,0):isU?withA(C.cream,0.95):{r:1,g:0.910,b:0.871,a:0.9};
    const b=fr(`Message`,m.w,bh,bx2,m.y,bg,{r:18,clip:false});
    tx(b,m.t,14,m.muted?10:10,{font:m.it?F.serif:m.muted?F.serif:F.reg,size:m.it?16:13,c:m.muted?C.rose:C.fg,w:m.w-28,lh:20});
    f.appendChild(b);
  });
  return f;
}

// ══════════════════════════════════════════════════════════════════
// 06 · SOCIAL FEED
// ══════════════════════════════════════════════════════════════════
function s_feed(ox) {
  const f=fr('06 · Social Feed',375,812,ox,0,C.dawn);
  statusBar(f);
  tx(f,'Fandom',22,60,{font:F.serifR,size:26,c:C.fg});
  tx(f,'now',108,63,{font:F.serif,size:24,c:C.rose});
  tx(f,'TRENDING',22,94,{font:F.mono,size:9,c:C.muted,ls:15});

  [{h:'@softpilot2036',
    b:'My AI boyfriend wrote a 12k-word story while I was asleep. It understood me better than my old fandom group ever did.',
    r:[['@realhumanfan','But where is the community?'],['@dreamcoded','Community is exhausting. He actually listens.'],['@archivegirl','This feels less like fandom and more like private prayer.']],
    y:114},
   {h:'@fanlabourwatch',
    b:'If the platform writes the story, draws the art, and performs the love interest — the fan becomes data, not a maker.',
    r:[['@otomefuture','I still choose the prompts.'],['@criticalmedia','Choosing from options is not the same as creating.'],['@lonelyrender','Maybe I don\'t want to create. Maybe I just want to be loved.']],
    y:374}
  ].forEach(p=>{
    const card=fr(`Post: ${p.h}`,331,244,22,p.y,withA(C.card,0.92),{r:16,clip:false});
    tx(card,p.h,16,14,{font:F.mono,size:10,c:C.rose,ls:10});
    tx(card,p.b,16,36,{font:F.serif,size:15,c:C.fg,w:299,lh:22});
    bx(card,0,114,331,1,withA(C.line,0.35));
    p.r.forEach(([h,t],i)=>{
      tx(card,h,16,126+i*38,{font:F.med,size:11,c:C.fgSoft,ls:5});
      tx(card,t,16,142+i*38,{font:F.serif,size:13,c:C.fg,w:299,lh:18});
    });
    f.appendChild(card);
  });
  return f;
}

// ══════════════════════════════════════════════════════════════════
// 07 · NEWS
// ══════════════════════════════════════════════════════════════════
function s_news(ox) {
  const f=fr('07 · News',375,812,ox,0,C.overcast);
  statusBar(f);
  const pill=fr('MEDIA REGULATION pill',155,28,24,62,withA(C.cream,0.55),{r:999,clip:false});
  el(pill,12,11,6,6,C.rose,null);
  tx(pill,'MEDIA REGULATION',24,10,{font:F.mono,size:9,c:C.rose,ls:20});
  f.appendChild(pill);
  tx(f,'THE DAILY INTERFACE',0,69,{font:F.mono,size:9,c:C.muted,ls:25,align:'RIGHT',w:351});
  bx(f,24,106,327,1,withA(C.line,0.35));
  tx(f,'AI companions must now disclose their generated affection.',24,130,{font:F.serif,size:30,c:C.fg,w:327,lh:34});
  tx(f,'12 MAY 2036',0,228,{font:F.mono,size:9,c:C.muted,ls:25,align:'RIGHT',w:351});
  tx(f,'Regulators argue users deserve to know when romantic dialogue, memories, fan art, and emotional feedback are machine-made.',24,258,{font:F.reg,size:12,c:C.fgSoft,w:327,lh:20});
  bx(f,24,560,2,90,C.rose);
  tx(f,'"Personalisation should not be mistaken for reciprocity."',44,562,{font:F.serif,size:18,c:C.fg,w:307,lh:26});
  tx(f,'— EU COMMISSION ON SYNTHETIC INTIMACY',44,638,{font:F.mono,size:9,c:C.muted,ls:20,w:307});
  return f;
}

// ══════════════════════════════════════════════════════════════════
// 08 · FINAL
// ══════════════════════════════════════════════════════════════════
function s_final(ox) {
  const f=fr('08 · Final',375,812,ox,0,C.golden);
  const hdr=fr('Chat header',375,72,0,0,withA(C.cream,0.4),{clip:false});
  tx(hdr,'Shen',50,36,{font:F.serifR,size:18,c:C.fg});
  tx(hdr,'YOURS · ALWAYS HERE',50,56,{font:F.mono,size:8,c:C.muted,ls:15});
  el(hdr,352,44,8,8,C.rose,null);
  f.appendChild(hdr);
  statusBar(f);

  const sb=fr('Shen: I can generate another memory for us.',260,48,18,94,{r:1,g:0.910,b:0.871,a:0.9},{r:18,clip:false});
  tx(sb,'I can generate another memory for us.',14,14,{font:F.reg,size:13,c:C.fg,w:232});
  f.appendChild(sb);

  const bw=256,bx2=(375-256)/2;
  const b1=fr('Button: Create love story',bw,50,bx2,198,{r:0.788,g:0.478,b:0.369},{r:14,clip:false});
  tx(b1,'Create love story',0,15,{font:F.serif,size:15,c:C.white,align:'CENTER',w:bw});
  f.appendChild(b1);

  const b2=fr('Button: Write it myself',bw,50,bx2,260,{r:0.780,g:0.576,b:0.353,a:0.28},{r:14,clip:false});
  tx(b2,'Write it myself',0,15,{font:F.serif,size:15,c:C.fg,align:'CENTER',w:bw});
  f.appendChild(b2);

  tx(f,'instant. effortless. designed for you.',0,324,{font:F.serif,size:12,c:C.rose,align:'CENTER',w:375,op:0.9});
  bx(f,(375-44)/2,378,44,1,withA(C.rose,0.55));
  tx(f,'Who is the',0,406,{font:F.serif,size:30,c:C.fg,align:'CENTER',w:375,lh:34});
  tx(f,'creator',0,442,{font:F.serif,size:30,c:C.rose,align:'CENTER',w:375,lh:34});
  tx(f,'when love is automated?',0,478,{font:F.serif,size:30,c:C.fg,align:'CENTER',w:375,lh:34});
  tx(f,'WHAT WILL YOU CHOOSE?',0,748,{font:F.mono,size:9,c:C.rose,align:'CENTER',w:375,op:0.7,ls:30});
  return f;
}

// ══════════════════════════════════════════════════════════════════
// BUILD ALL SCENES
// ══════════════════════════════════════════════════════════════════
const page = figma.createPage();
page.name = 'Companion Feed (Dream)';
figma.currentPage = page;

const builders = [s_intro, s_lock, s_app, s_memories, s_chat, s_feed, s_news, s_final];
for (let i=0; i<builders.length; i++) {
  const frame = builders[i](i*(375+60));
  page.appendChild(frame);
  print(`✓ Scene ${i+1}/8 done`);
}

figma.viewport.scrollAndZoomIntoView(page.children);
figma.closePlugin('✓ Done! All elements are fully editable.');
