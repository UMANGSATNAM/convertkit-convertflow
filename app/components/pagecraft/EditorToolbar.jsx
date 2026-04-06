import { useState, useRef, useCallback } from "react";

export default function EditorToolbar({
  pageTitle, onTitleChange, canUndo, canRedo, onUndo, onRedo,
  viewport, onViewportChange, score, onAiRegenerate, onDeploy,
  onBack, regenerating,
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const titleRef = useRef(null);

  const handleTitleBlur = useCallback(() => {
    setEditingTitle(false);
  }, []);

  return (
    <div className="pct-toolbar">
      {/* Left */}
      <div className="pct-toolbar-left">
        <button className="pct-toolbar-back" onClick={onBack} title="Back to wizard">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
        </button>
        <div className="pct-toolbar-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>
          <span className="pct-brand-name">PageCraft</span>
        </div>
        <div className="pct-toolbar-divider" />
        {editingTitle ? (
          <input
            ref={titleRef}
            className="pct-title-input"
            value={pageTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
            autoFocus
          />
        ) : (
          <button className="pct-title-btn" onClick={() => setEditingTitle(true)}>
            {pageTitle || "Untitled Page"}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" /></svg>
          </button>
        )}
      </div>

      {/* Center — Viewport */}
      <div className="pct-toolbar-center">
        {[
          { id: "desktop", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>, title: "Desktop" },
          { id: "tablet", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M12 18h.01" /></svg>, title: "Tablet" },
          { id: "mobile", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>, title: "Mobile" },
        ].map((v) => (
          <button
            key={v.id}
            className={`pct-vp-btn ${viewport === v.id ? "pct-vp-btn--active" : ""}`}
            onClick={() => onViewportChange(v.id)}
            title={v.title}
          >
            {v.icon}
          </button>
        ))}
      </div>

      {/* Right — Actions */}
      <div className="pct-toolbar-right">
        <div className="pct-undo-group">
          <button className="pct-icon-btn" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
          </button>
          <button className="pct-icon-btn" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" /></svg>
          </button>
        </div>

        <button className="pct-ai-btn" onClick={onAiRegenerate} disabled={regenerating} title="Regenerate with AI">
          {regenerating ? <span className="pct-spinner-sm" /> : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
          )}
          <span>AI</span>
        </button>

        {score !== null && (
          <div className={`pct-score-badge ${score >= 80 ? "pct-score--high" : score >= 60 ? "pct-score--mid" : "pct-score--low"}`}>
            {score}
          </div>
        )}

        <button className="pct-deploy-btn" onClick={onDeploy}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>
          Deploy
        </button>
      </div>
    </div>
  );
}

export const toolbarStyles = `
  .pct-toolbar {
    height: 52px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 16px; background: #0C1021; border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0; z-index: 100; gap: 12px;
  }
  .pct-toolbar-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
  .pct-toolbar-back { background: none; border: none; color: #64748B; cursor: pointer; padding: 6px; border-radius: 6px; display: flex; transition: all 0.15s; }
  .pct-toolbar-back:hover { color: #CBD5E1; background: rgba(255,255,255,0.06); }
  .pct-toolbar-brand { display: flex; align-items: center; gap: 6px; color: #10B981; }
  .pct-brand-name { font-family: 'Rubik', sans-serif; font-size: 14px; font-weight: 700; color: #fff; }
  .pct-toolbar-divider { width: 1px; height: 20px; background: rgba(255,255,255,0.1); }
  .pct-title-btn { background: none; border: none; color: #CBD5E1; font-size: 13px; font-weight: 500; cursor: pointer; padding: 4px 8px; border-radius: 6px; display: flex; align-items: center; gap: 6px; transition: all 0.15s; font-family: 'Nunito Sans', sans-serif; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pct-title-btn:hover { background: rgba(255,255,255,0.06); }
  .pct-title-btn svg { opacity: 0; transition: opacity 0.15s; flex-shrink: 0; }
  .pct-title-btn:hover svg { opacity: 1; }
  .pct-title-input { background: rgba(255,255,255,0.06); border: 1px solid #10B981; color: #fff; font-size: 13px; padding: 4px 10px; border-radius: 6px; outline: none; font-family: 'Nunito Sans', sans-serif; width: 200px; }

  .pct-toolbar-center { display: flex; align-items: center; gap: 2px; background: rgba(255,255,255,0.04); border-radius: 8px; padding: 3px; }
  .pct-vp-btn { background: none; border: none; color: #475569; padding: 6px 10px; cursor: pointer; border-radius: 6px; display: flex; align-items: center; transition: all 0.15s; }
  .pct-vp-btn:hover { color: #94A3B8; }
  .pct-vp-btn--active { background: #10B981; color: #fff; box-shadow: 0 1px 4px rgba(16,185,129,0.3); }

  .pct-toolbar-right { display: flex; align-items: center; gap: 8px; flex: 1; justify-content: flex-end; }
  .pct-undo-group { display: flex; gap: 2px; background: rgba(255,255,255,0.04); border-radius: 6px; padding: 2px; }
  .pct-icon-btn { background: none; border: none; color: #64748B; padding: 6px; cursor: pointer; border-radius: 4px; display: flex; transition: all 0.15s; }
  .pct-icon-btn:hover:not(:disabled) { color: #CBD5E1; background: rgba(255,255,255,0.06); }
  .pct-icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .pct-ai-btn { display: flex; align-items: center; gap: 4px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #A5B4FC; font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 6px; cursor: pointer; transition: all 0.15s; font-family: 'Nunito Sans', sans-serif; }
  .pct-ai-btn:hover:not(:disabled) { background: rgba(99,102,241,0.25); border-color: rgba(99,102,241,0.5); }
  .pct-ai-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .pct-spinner-sm { width: 12px; height: 12px; border: 2px solid rgba(165,180,252,0.3); border-top-color: #A5B4FC; border-radius: 50%; animation: pct-spin 0.6s linear infinite; display: inline-block; }
  @keyframes pct-spin { to { transform: rotate(360deg); } }

  .pct-score-badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; font-family: 'Rubik', sans-serif; }
  .pct-score--high { background: rgba(16,185,129,0.15); color: #10B981; }
  .pct-score--mid { background: rgba(245,158,11,0.15); color: #F59E0B; }
  .pct-score--low { background: rgba(239,68,68,0.15); color: #EF4444; }

  .pct-deploy-btn { display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #10B981, #059669); color: #fff; border: none; padding: 7px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: 'Nunito Sans', sans-serif; white-space: nowrap; }
  .pct-deploy-btn:hover { box-shadow: 0 4px 16px rgba(16,185,129,0.4); transform: translateY(-1px); }
`;
