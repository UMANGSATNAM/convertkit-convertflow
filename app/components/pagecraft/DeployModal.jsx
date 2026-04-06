import { useState } from "react";

export default function DeployModal({ onClose, onDeploy, pageTitle, score, sections, deploying, deployResult }) {
  const [title, setTitle] = useState(pageTitle || "My Page");
  const [metaDesc, setMetaDesc] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDeploy = async () => {
    await onDeploy({ title, metaDesc });
  };

  if (deployResult) {
    return (
      <div className="dpm-overlay" onClick={onClose}>
        <div className="dpm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="dpm-success">
            <div className="dpm-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" width="48" height="48"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </div>
            <h3 className="dpm-success-title">Page Published! 🎉</h3>
            <p className="dpm-success-desc">Your page is now live and ready for visitors.</p>
            <a href={deployResult.pageUrl} target="_blank" rel="noopener noreferrer" className="dpm-success-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              View Live Page
            </a>
            <button className="dpm-done-btn" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dpm-overlay" onClick={onClose}>
      <div className="dpm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dpm-head">
          <div>
            <h3 className="dpm-title">Deploy to Shopify</h3>
            <p className="dpm-subtitle">Publish this page to your store</p>
          </div>
          <button className="dpm-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="dpm-body">
          {/* Preview summary */}
          <div className="dpm-preview-strip">
            <div className="dpm-preview-sections">
              {sections.filter(s => s.visible).slice(0, 6).map((s) => {
                const colors = { hero: "#10B981", product_showcase: "#3B82F6", trust_badges: "#F59E0B", social_proof: "#8B5CF6", faq: "#EC4899", footer: "#64748B" };
                return <div key={s.id} className="dpm-preview-block" style={{ background: colors[s.type] || "#475569" }} title={s.type} />;
              })}
            </div>
            <span className="dpm-section-count">{sections.filter(s => s.visible).length} sections</span>
          </div>

          {/* Score */}
          {score !== null && (
            <div className={`dpm-score-row ${score >= 80 ? "dpm-score--high" : score >= 60 ? "dpm-score--mid" : "dpm-score--low"}`}>
              <div className="dpm-score-label">Conversion Score</div>
              <div className="dpm-score-value">{score}/100</div>
            </div>
          )}

          {/* SEO Fields */}
          <div className="dpm-field">
            <label className="dpm-label">Page Title</label>
            <input className="dpm-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="dpm-field">
            <label className="dpm-label">Meta Description</label>
            <textarea className="dpm-textarea" rows={2} value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} placeholder="Brief description for search engines..." />
          </div>
        </div>

        <div className="dpm-footer">
          <button className="dpm-cancel" onClick={onClose}>Cancel</button>
          <button className="dpm-deploy" onClick={handleDeploy} disabled={deploying}>
            {deploying ? (
              <>
                <span className="dpm-spinner" />
                Publishing...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>
                Publish Page
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export const deployModalStyles = `
  .dpm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(6px); animation: dpm-fade 0.15s ease; }
  @keyframes dpm-fade { from { opacity: 0; } to { opacity: 1; } }
  .dpm-modal { background: #0C1021; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; width: 440px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); animation: dpm-slide 0.2s ease; }
  @keyframes dpm-slide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .dpm-head { display: flex; align-items: flex-start; justify-content: space-between; padding: 20px 24px 12px; }
  .dpm-title { font-family: 'Rubik', sans-serif; font-size: 17px; font-weight: 700; color: #fff; margin: 0; }
  .dpm-subtitle { font-size: 12px; color: #64748B; margin: 4px 0 0; }
  .dpm-close { background: none; border: none; color: #475569; cursor: pointer; padding: 6px; border-radius: 8px; display: flex; transition: all 0.15s; }
  .dpm-close:hover { color: #CBD5E1; background: rgba(255,255,255,0.06); }

  .dpm-body { padding: 0 24px 16px; display: flex; flex-direction: column; gap: 14px; }

  .dpm-preview-strip { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; }
  .dpm-preview-sections { display: flex; gap: 3px; flex: 1; }
  .dpm-preview-block { height: 20px; flex: 1; border-radius: 3px; opacity: 0.6; }
  .dpm-section-count { font-size: 11px; font-weight: 600; color: #64748B; white-space: nowrap; }

  .dpm-score-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-radius: 10px; }
  .dpm-score--high { background: rgba(16,185,129,0.1); }
  .dpm-score--mid { background: rgba(245,158,11,0.1); }
  .dpm-score--low { background: rgba(239,68,68,0.1); }
  .dpm-score-label { font-size: 12px; font-weight: 600; color: #94A3B8; }
  .dpm-score-value { font-size: 16px; font-weight: 800; font-family: 'Rubik', sans-serif; }
  .dpm-score--high .dpm-score-value { color: #10B981; }
  .dpm-score--mid .dpm-score-value { color: #F59E0B; }
  .dpm-score--low .dpm-score-value { color: #EF4444; }

  .dpm-field { display: flex; flex-direction: column; gap: 4px; }
  .dpm-label { font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.06em; }
  .dpm-input, .dpm-textarea { width: 100%; padding: 10px 14px; background: #151B2E; border: 1.5px solid #1E293B; border-radius: 8px; color: #fff; font-size: 13px; font-family: 'Nunito Sans', sans-serif; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
  .dpm-input:focus, .dpm-textarea:focus { border-color: #10B981; }
  .dpm-textarea { resize: vertical; min-height: 50px; }

  .dpm-footer { display: flex; gap: 8px; padding: 12px 24px 20px; justify-content: flex-end; }
  .dpm-cancel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #94A3B8; padding: 9px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: 'Nunito Sans', sans-serif; }
  .dpm-cancel:hover { background: rgba(255,255,255,0.08); }
  .dpm-deploy { display: flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #10B981, #059669); color: #fff; border: none; padding: 9px 24px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: 'Nunito Sans', sans-serif; }
  .dpm-deploy:hover:not(:disabled) { box-shadow: 0 4px 16px rgba(16,185,129,0.4); transform: translateY(-1px); }
  .dpm-deploy:disabled { opacity: 0.6; cursor: not-allowed; }
  .dpm-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: dpm-spin 0.6s linear infinite; display: inline-block; }
  @keyframes dpm-spin { to { transform: rotate(360deg); } }

  .dpm-success { padding: 40px 32px; text-align: center; }
  .dpm-success-icon { margin-bottom: 16px; animation: dpm-pop 0.3s ease; }
  @keyframes dpm-pop { 0% { transform: scale(0.5); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
  .dpm-success-title { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 6px; }
  .dpm-success-desc { font-size: 14px; color: #64748B; margin: 0 0 24px; }
  .dpm-success-link { display: inline-flex; align-items: center; gap: 6px; background: rgba(16,185,129,0.1); color: #10B981; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none; transition: all 0.15s; margin-bottom: 12px; }
  .dpm-success-link:hover { background: rgba(16,185,129,0.2); }
  .dpm-done-btn { display: block; width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #94A3B8; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; margin-top: 8px; font-family: 'Nunito Sans', sans-serif; }
  .dpm-done-btn:hover { background: rgba(255,255,255,0.1); }
`;
