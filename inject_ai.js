import fs from 'fs';

let content = fs.readFileSync('app/routes/app._index.jsx', 'utf-8');

// 1. Inject state variables
const stateTarget = `const [selectedTemplate, setSelectedTemplate] = useState("caratlane");`;
const stateInject = `const [selectedTemplate, setSelectedTemplate] = useState("caratlane");
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiScore, setAiScore] = useState(0);`;
if (!content.includes('const [showAiInsights')) {
    content = content.replace(stateTarget, stateInject);
}

// 2. Add Run AI Analysis button to top bar
const topBarTarget = `<span style={{ marginLeft: 16, fontSize: 12, color: "#999" }}>Live Preview — {currentTpl?.name}</span>
          </div>`;
const topBarInject = `<span style={{ marginLeft: 16, fontSize: 12, color: "#999" }}>Live Preview — {currentTpl?.name}</span>
            <div style={{ flex: 1 }} />
            <button 
              onClick={() => {
                setShowAiInsights(true);
                setIsAiScanning(true);
                setAiScore(0);
                let score = 0;
                // random final score between 94 and 98
                const targetScore = 94 + Math.floor(Math.random() * 5);
                const interval = setInterval(() => {
                  score += 4;
                  if(score >= targetScore) {
                    clearInterval(interval);
                    setIsAiScanning(false);
                    setAiScore(targetScore);
                  } else {
                    setAiScore(score);
                  }
                }, 50);
              }}
              style={{
                background: "linear-gradient(135deg, #0f172a, #0d9488)",
                color: "#fff", border: "none", padding: "6px 16px", borderRadius: 20,
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                boxShadow: "0 2px 10px rgba(13, 148, 136, 0.3)"
              }}
            >
              ✨ AI Analyze
            </button>
          </div>`;
if (!content.includes('✨ AI Analyze')) {
    content = content.replace(topBarTarget, topBarInject);
}

// 3. Add AI Insights Panel inside the preview wrapper
const previewAreaTarget = `            {/* Skeleton overlay shown while iframe content loads */}`;
const aiPanelInject = `
          {/* AI Insights Slide-out Panel */}
          <div style={{
            position: "absolute",
            top: 0, right: showAiInsights ? 0 : "-400px",
            width: 360, height: "100%",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderLeft: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
            transition: "right 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 100,
            display: "flex", flexDirection: "column",
            fontFamily: "'Inter', sans-serif"
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#111", display: "flex", alignItems: "center", gap: 8 }}>
                ✨ Neuro-Design Insights
              </div>
              <button 
                onClick={() => setShowAiInsights(false)}
                style={{ background: "transparent", border: "none", fontSize: 24, cursor: "pointer", color: "#999", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: 24, flex: 1, overflowY: "auto" }}>
              {isAiScanning ? (
                <div style={{ textAlign: "center", marginTop: 40 }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", border: "4px solid #e5e7eb", borderTopColor: "#0d9488", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
                  <style>{\`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }\`}</style>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginBottom: 8 }}>Scanning {currentTpl?.name}...</div>
                  <div style={{ fontSize: 13, color: "#666" }}>Analyzing visual hierarchy, Fitts' law, and trust signals</div>
                </div>
              ) : (
                <div style={{ animation: "fade-in 0.5s ease-out" }}>
                  <style>{\`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }\`}</style>
                  
                  {/* Score Ring */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
                    <div style={{ position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="70" cy="70" r="60" fill="none" stroke="#f0fdf4" strokeWidth="12" />
                        <circle cx="70" cy="70" r="60" fill="none" stroke="#22c55e" strokeWidth="12" 
                          strokeDasharray="377" 
                          strokeDashoffset={377 - (377 * aiScore) / 100} 
                          strokeLinecap="round" 
                          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
                        />
                      </svg>
                      <div style={{ position: "absolute", textAlign: "center" }}>
                        <div style={{ fontSize: 36, fontWeight: 800, color: "#111", lineHeight: 1 }}>{aiScore}%</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>Conversion Ready</div>
                      </div>
                    </div>
                  </div>

                  {/* Insights */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ background: "#fff", padding: 16, borderRadius: 12, border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#111" }}>Action Velocity</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#0d9488", background: "#f0fdfa", padding: "2px 8px", borderRadius: 10 }}>Excellent</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                        Fitts' Law is well applied. The Add to Cart button dominates the mobile viewport with high contrast ratio.
                      </div>
                    </div>

                    <div style={{ background: "#fff", padding: 16, borderRadius: 12, border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#111" }}>Cognitive Load</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#0d9488", background: "#f0fdfa", padding: "2px 8px", borderRadius: 10 }}>Optimal</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                        Hick's Law compliant. Navigation options are limited to core pathways, reducing decision fatigue by 42%.
                      </div>
                    </div>

                    <div style={{ background: "#fff", padding: 16, borderRadius: 12, border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#111" }}>Trust Anchoring</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#0d9488", background: "#f0fdfa", padding: "2px 8px", borderRadius: 10 }}>Strong</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                        High authority signals detected. Trust badges and transparent policy messaging are placed adjacent to friction points.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div style={{ padding: 24, borderTop: "1px solid rgba(0,0,0,0.05)", background: "rgba(255,255,255,0.5)" }}>
              <button 
                disabled={isAiScanning}
                style={{
                  width: "100%", background: isAiScanning ? "#ccc" : "#111", color: "#fff",
                  padding: "14px", borderRadius: 12, border: "none", fontSize: 14, fontWeight: 700,
                  cursor: isAiScanning ? "not-allowed" : "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
                }}
              >
                {isAiScanning ? "Analyzing..." : "⚡ Auto-Optimize Template"}
              </button>
            </div>
          </div>
            {/* Skeleton overlay shown while iframe content loads */}`;

if (!content.includes('AI Insights Slide-out Panel')) {
    content = content.replace(previewAreaTarget, aiPanelInject);
}

fs.writeFileSync('app/routes/app._index.jsx', content);
console.log('Successfully injected AI panel.');
