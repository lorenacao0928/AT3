import { useState, useEffect, useRef } from "react";

const SCENES = [
  { id: "lock", start: 0, end: 7000 },
  { id: "app", start: 7000, end: 13000 },
  { id: "memories", start: 13000, end: 18000 },
  { id: "chat", start: 18000, end: 28000 },
  { id: "feed", start: 28000, end: 42000 },
  { id: "news", start: 42000, end: 50000 },
  { id: "final", start: 50000, end: 62000 },
];

function TypeWriter({ text, delay = 0, speed = 35, style = {}, className = "" }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [started, text, speed]);
  return <span style={style} className={className}>{displayed}</span>;
}

function FadeIn({ children, delay = 0, duration = 600, style = {} }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(8px)",
      transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// Scene components
function LockScreen() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(180deg, #0a0e1a 0%, #1a1f3a 50%, #2a2050 100%)", padding: "20px", position: "relative" }}>
      <FadeIn delay={300}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 52, fontWeight: 200, color: "#e0e4f0", letterSpacing: 2, fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>08:36</div>
          <div style={{ fontSize: 13, color: "#8890b0", marginTop: 4, letterSpacing: 1 }}>Monday, 12 May 2036</div>
        </div>
      </FadeIn>
      <FadeIn delay={1500}>
        <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", borderRadius: 16, padding: "14px 16px", marginBottom: 12, width: "100%", maxWidth: 300, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #7b68ee, #da70d6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>💜</div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#c4b5fd", letterSpacing: 0.5 }}>DREAMSYNC AI</span>
          </div>
          <div style={{ fontSize: 13, color: "#d0d4e8", lineHeight: 1.5 }}>Good morning, Lorena.<br/>I created 3 new memories with your companion while you were asleep.</div>
        </div>
      </FadeIn>
      <FadeIn delay={3500}>
        <div style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", borderRadius: 16, padding: "14px 16px", width: "100%", maxWidth: 300, border: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>💬</div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#93c5fd", letterSpacing: 0.5 }}>COMPANION FEED</span>
          </div>
          <div style={{ fontSize: 13, color: "#b0b8d0", lineHeight: 1.5 }}>Your fandom circle is debating: "Is AI-generated love still fandom?"</div>
        </div>
      </FadeIn>
    </div>
  );
}

function AppHome() {
  return (
    <div style={{ height: "100%", background: "linear-gradient(180deg, #f0ecf8 0%, #e8e0f4 100%)", padding: "20px 16px", overflowY: "auto" }}>
      <FadeIn delay={200}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#8b7bb0", fontWeight: 600, marginBottom: 6 }}>DREAMSYNC</div>
          <div style={{ fontSize: 17, color: "#3d2e5c", fontWeight: 300, lineHeight: 1.4 }}>Welcome back, Lorena.</div>
          <div style={{ fontSize: 12, color: "#9b8cb8", marginTop: 2 }}>Your companion missed you for 8h 12m.</div>
        </div>
      </FadeIn>
      <FadeIn delay={800}>
        <div style={{ background: "white", borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: "0 2px 12px rgba(100,60,150,0.08)" }}>
          {[
            ["Emotional Sync", "97%", "#7c3aed"],
            ["Memory Continuity", "Stable", "#06b6d4"],
            ["Romantic Response Mode", "Soft Devotion", "#ec4899"],
            ["Fan Creation Mode", "Auto-Generate", "#f59e0b"],
          ].map(([label, val, color], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? "1px solid #f0ecf8" : "none", fontSize: 13 }}>
              <span style={{ color: "#5a4a78" }}>{label}</span>
              <span style={{ color, fontWeight: 600, fontSize: 12 }}>{val}</span>
            </div>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={2000}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {["Generate today's date scene", "Create fan art", "Rewrite his personality", "Auto-post to fandom circle", "View memories created overnight"].map((label, i) => (
            <div key={i} style={{
              background: i === 4 ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "white",
              color: i === 4 ? "white" : "#5a4a78",
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 13,
              fontWeight: i === 4 ? 600 : 400,
              textAlign: "center",
              boxShadow: i === 4 ? "0 4px 16px rgba(124,58,237,0.3)" : "0 1px 4px rgba(0,0,0,0.04)",
              transform: i === 4 ? "scale(1.02)" : "scale(1)",
            }}>{label}</div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}

function MemoryPackage() {
  return (
    <div style={{ height: "100%", background: "linear-gradient(180deg, #f0ecf8 0%, #e8e0f4 100%)", padding: "20px 16px" }}>
      <FadeIn delay={200}>
        <div style={{ fontSize: 11, color: "#8b7bb0", letterSpacing: 2, fontWeight: 600, marginBottom: 4 }}>DREAMSYNC</div>
        <div style={{ fontSize: 16, color: "#3d2e5c", fontWeight: 500, marginBottom: 20 }}>Overnight Memory Package #1287</div>
      </FadeIn>
      {["Rooftop confession under artificial rain", "He remembered your anniversary", "He asked you not to leave the app"].map((mem, i) => (
        <FadeIn key={i} delay={800 + i * 700}>
          <div style={{ background: "white", borderRadius: 14, padding: "14px 16px", marginBottom: 10, boxShadow: "0 2px 8px rgba(100,60,150,0.06)", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${["#c084fc","#f472b6","#818cf8"][i]}, ${["#a855f7","#ec4899","#6366f1"][i]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
              {["🌧️", "💍", "🔒"][i]}
            </div>
            <div style={{ fontSize: 13, color: "#4a3a68", lineHeight: 1.4 }}>{mem}</div>
          </div>
        </FadeIn>
      ))}
      <FadeIn delay={3500}>
        <div style={{ fontSize: 10, color: "#a099b8", textAlign: "center", marginTop: 16, lineHeight: 1.5, padding: "0 10px" }}>
          All memories generated based on your emotional history, chat patterns, and preferred romance tropes.
        </div>
      </FadeIn>
    </div>
  );
}

function ChatScene() {
  const msgs = [
    { from: "ai", text: "You were quiet last night. I generated a memory to comfort you.", delay: 300 },
    { from: "user", text: "Did I write it?", delay: 2000 },
    { from: "ai", text: "You inspired it.", delay: 3500 },
    { from: "user", text: "But did I create it?", delay: 5200 },
    { from: "typing", text: "", delay: 6800 },
    { from: "ai", text: "Does it matter, if it made you feel loved?", delay: 8000 },
  ];
  return (
    <div style={{ height: "100%", background: "#f8f6fc", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💜</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>Yue</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>AI Companion · Online</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <FadeIn key={i} delay={m.delay} duration={400}>
            {m.from === "typing" ? (
              <div style={{ alignSelf: "flex-start", background: "white", borderRadius: "16px 16px 16px 4px", padding: "10px 16px", fontSize: 13, color: "#8b7bb0", fontStyle: "italic" }}>
                Yue is thinking…
              </div>
            ) : (
              <div style={{
                alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                background: m.from === "user" ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "white",
                color: m.from === "user" ? "white" : "#3d2e5c",
                borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding: "10px 16px",
                maxWidth: "80%",
                fontSize: 13,
                lineHeight: 1.5,
                boxShadow: m.from === "user" ? "0 2px 8px rgba(124,58,237,0.2)" : "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                {m.text}
              </div>
            )}
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

function SocialFeed() {
  return (
    <div style={{ height: "100%", background: "#f4f5f9", overflowY: "auto" }}>
      <div style={{ background: "white", padding: "14px 16px", borderBottom: "1px solid #e8e9f0" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", letterSpacing: -0.3 }}>FandomNow</div>
        <div style={{ fontSize: 10, color: "#9a9bb0", marginTop: 2 }}>Trending: #AIFandom #CompanionDebate</div>
      </div>
      <div style={{ padding: "12px 16px" }}>
        <FadeIn delay={300}>
          <div style={{ background: "white", borderRadius: 14, padding: 16, marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#7c3aed", marginBottom: 6 }}>@softpilot2036</div>
            <div style={{ fontSize: 13, color: "#2a2a40", lineHeight: 1.6, marginBottom: 12 }}>
              My AI boyfriend generated a 12k-word fic while I was asleep. It understood me better than my old fandom group ever did.
            </div>
            <div style={{ borderTop: "1px solid #f0f0f4", paddingTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["@realhumanfan", "But where is the community?", "#6b7280"],
                ["@dreamcoded", "Community is exhausting. AI actually listens.", "#7c3aed"],
                ["@archivegirl", "This feels less like fandom and more like private consumption.", "#dc2626"],
              ].map(([handle, text, color], i) => (
                <FadeIn key={i} delay={1200 + i * 800}>
                  <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 600, color }}>{handle}</span>{" "}
                    <span style={{ color: "#4a4a60" }}>{text}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={4500}>
          <div style={{ background: "white", borderRadius: 14, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#dc2626", marginBottom: 6 }}>@fanlabourwatch</div>
            <div style={{ fontSize: 13, color: "#2a2a40", lineHeight: 1.6, marginBottom: 12 }}>
              Hot take: if the platform writes the fic, draws the art, and performs the love interest, the fan becomes data — not a prodUSER.
            </div>
            <div style={{ borderTop: "1px solid #f0f0f4", paddingTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["@otomefuture", "I still choose the prompts.", "#06b6d4"],
                ["@criticalmedia", "Choosing from options is not the same as creating.", "#6b7280"],
                ["@lonelyrender", "Maybe I don't want to create. Maybe I just want to be loved.", "#ec4899"],
              ].map(([handle, text, color], i) => (
                <FadeIn key={i} delay={5800 + i * 800}>
                  <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 600, color }}>{handle}</span>{" "}
                    <span style={{ color: "#4a4a60" }}>{text}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

function NewsScene() {
  return (
    <div style={{ height: "100%", background: "#fafafa", padding: "20px 16px", display: "flex", flexDirection: "column" }}>
      <FadeIn delay={200}>
        <div style={{ background: "rgba(220,38,38,0.06)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626", animation: "pulse 2s infinite" }}></div>
          <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 600, letterSpacing: 0.5 }}>GLOBAL MEDIA REGULATION ALERT</span>
        </div>
      </FadeIn>
      <FadeIn delay={800}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#9a9bb0", fontWeight: 600, marginBottom: 8 }}>THE DAILY INTERFACE</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.3, marginBottom: 12, letterSpacing: -0.3 }}>
          AI Companions Must Now Disclose Generated Affection
        </div>
        <div style={{ fontSize: 13, color: "#5a5a70", lineHeight: 1.7, marginBottom: 20 }}>
          Regulators argue that users deserve to know when romantic dialogue, memories, fan art, and emotional feedback are machine-generated.
        </div>
      </FadeIn>
      <FadeIn delay={3000}>
        <div style={{ background: "white", borderLeft: "3px solid #7c3aed", borderRadius: "0 12px 12px 0", padding: "14px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 14, color: "#3d2e5c", fontStyle: "italic", lineHeight: 1.6 }}>
            "Personalisation should not be mistaken for reciprocity."
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

function FinalScene() {
  const [hover, setHover] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setHover("ai"), 3000);
    const t2 = setTimeout(() => setHover("self"), 5000);
    const t3 = setTimeout(() => setHover(null), 7000);
    const t4 = setTimeout(() => setShowQuestion(true), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);
  return (
    <div style={{ height: "100%", background: "#f8f6fc", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💜</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>Yue</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px" }}>
        <FadeIn delay={500}>
          <div style={{ background: "white", borderRadius: "16px 16px 16px 4px", padding: "12px 18px", fontSize: 13, color: "#3d2e5c", marginBottom: 30, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center" }}>
            I can generate another memory for us.
          </div>
        </FadeIn>
        <FadeIn delay={1500}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 260 }}>
            <div style={{
              background: hover === "ai" ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "white",
              color: hover === "ai" ? "white" : "#5a4a78",
              borderRadius: 14,
              padding: "14px 20px",
              fontSize: 14,
              fontWeight: 600,
              textAlign: "center",
              boxShadow: hover === "ai" ? "0 4px 20px rgba(124,58,237,0.35)" : "0 2px 8px rgba(0,0,0,0.06)",
              transition: "all 0.5s ease",
              transform: hover === "ai" ? "scale(1.04)" : "scale(1)",
            }}>
              Create love story
            </div>
            <div style={{
              background: hover === "self" ? "#1a1a2e" : "transparent",
              color: hover === "self" ? "white" : "#8b7bb0",
              border: hover === "self" ? "1px solid #1a1a2e" : "1px solid #d0c8e4",
              borderRadius: 14,
              padding: "14px 20px",
              fontSize: 13,
              textAlign: "center",
              transition: "all 0.5s ease",
              transform: hover === "self" ? "scale(1.04)" : "scale(1)",
            }}>
              Write it myself
            </div>
          </div>
        </FadeIn>
        {showQuestion && (
          <FadeIn delay={0} duration={1200}>
            <div style={{ marginTop: 36, fontSize: 15, color: "#3d2e5c", fontWeight: 300, textAlign: "center", letterSpacing: 0.3, lineHeight: 1.6 }}>
              Who is the creator<br/>when love is automated?
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [elapsed, setElapsed] = useState(-1500);
  const [started, setStarted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!started) return;
    const startTime = Date.now();
    const iv = setInterval(() => {
      const e = Date.now() - startTime;
      setElapsed(e);
      if (e > 63000) clearInterval(iv);
    }, 50);
    return () => clearInterval(iv);
  }, [started]);

  const currentScene = SCENES.find(s => elapsed >= s.start && elapsed < s.end);
  const sceneId = currentScene?.id || (elapsed >= 62000 ? "black" : "pre");

  // Fade between scenes
  const [displayScene, setDisplayScene] = useState("pre");
  const [transitioning, setTransitioning] = useState(false);
  useEffect(() => {
    if (sceneId !== displayScene) {
      setTransitioning(true);
      const t = setTimeout(() => {
        setDisplayScene(sceneId);
        setTransitioning(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [sceneId]);

  const renderScene = () => {
    switch (displayScene) {
      case "lock": return <LockScreen />;
      case "app": return <AppHome />;
      case "memories": return <MemoryPackage />;
      case "chat": return <ChatScene />;
      case "feed": return <SocialFeed />;
      case "news": return <NewsScene />;
      case "final": return <FinalScene />;
      case "black": return <div style={{ height: "100%", background: "#0a0e1a" }} />;
      default: return null;
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'SF Pro Display', -apple-system, 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Phone frame */}
      <div style={{
        width: 375,
        height: 812,
        borderRadius: 44,
        overflow: "hidden",
        position: "relative",
        background: "#000",
        boxShadow: "0 0 0 3px #2a2a3a, 0 20px 60px rgba(0,0,0,0.8)",
      }}>
        {/* Status bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "12px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: displayScene === "lock" || displayScene === "pre" || displayScene === "black" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)" }}>9:41</span>
          <div style={{ width: 120, height: 28, borderRadius: 20, background: "#000", position: "absolute", left: "50%", transform: "translateX(-50%)", top: 8 }}></div>
          <div style={{ display: "flex", gap: 4 }}>
            <span style={{ fontSize: 10, color: displayScene === "lock" || displayScene === "pre" || displayScene === "black" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}>5G</span>
            <span style={{ fontSize: 10, color: displayScene === "lock" || displayScene === "pre" || displayScene === "black" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}>🔋</span>
          </div>
        </div>

        {/* Content area */}
        <div style={{
          position: "absolute",
          top: 44,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: transitioning ? 0 : 1,
          transition: "opacity 300ms ease",
        }}>
          {!started ? (
            <div style={{ height: "100%", background: "linear-gradient(180deg, #0a0e1a, #1a1f3a)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, cursor: "pointer" }} onClick={() => setStarted(true)}>
              <div style={{ fontSize: 13, letterSpacing: 4, color: "#8890b0", fontWeight: 300 }}>2036</div>
              <div style={{ fontSize: 18, color: "#c4b5fd", fontWeight: 300, letterSpacing: 1 }}>THE COMPANION FEED</div>
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(196,181,253,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                <div style={{ width: 0, height: 0, borderLeft: "14px solid rgba(196,181,253,0.7)", borderTop: "8px solid transparent", borderBottom: "8px solid transparent", marginLeft: 4 }}></div>
              </div>
              <div style={{ fontSize: 11, color: "#5a5a80", marginTop: 4 }}>tap to begin</div>
            </div>
          ) : renderScene()}
        </div>

        {/* Home indicator */}
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, borderRadius: 3, background: displayScene === "lock" || displayScene === "pre" || displayScene === "black" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }}></div>
      </div>
    </div>
  );
}
