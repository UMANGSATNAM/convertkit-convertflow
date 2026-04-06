// BuilderToolbar — Top toolbar with page title, viewport, undo/redo, and actions
export default function BuilderToolbar({
  pageTitle, onTitleChange, viewport, onViewportChange,
  canUndo, canRedo, onUndo, onRedo, zoom, onZoomChange,
  onSave, onPublish, onPreview, onBack, saving, hasChanges,
}) {
  return (
    <div className="pbt-root">
      {/* Left: Back + Logo */}
      <div className="pbt-left">
        <button className="pbt-back" onClick={onBack} title="Back to dashboard">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
        </button>
        <div className="pbt-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/></svg>
          <span>PageCraft</span>
        </div>
        <div className="pbt-divider" />
        <input className="pbt-title-input" value={pageTitle} onChange={(e) => onTitleChange(e.target.value)} placeholder="Page title..." />
      </div>

      {/* Center: Viewport + Zoom */}
      <div className="pbt-center">
        <div className="pbt-viewport-group">
          {[
            { id: "desktop", label: "Desktop", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>' },
            { id: "tablet", label: "Tablet", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>' },
            { id: "mobile", label: "Mobile", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M12 18h.01"/></svg>' },
          ].map((v) => (
            <button key={v.id} className={`pbt-vp-btn ${viewport === v.id ? "pbt-vp-btn--active" : ""}`} onClick={() => onViewportChange(v.id)} title={v.label}>
              <span dangerouslySetInnerHTML={{ __html: v.icon }} />
            </button>
          ))}
        </div>
        <div className="pbt-divider" />
        <div className="pbt-zoom-group">
          <button className="pbt-zoom-btn" onClick={() => onZoomChange(Math.max(25, zoom - 10))}>−</button>
          <span className="pbt-zoom-label">{zoom}%</span>
          <button className="pbt-zoom-btn" onClick={() => onZoomChange(Math.min(200, zoom + 10))}>+</button>
        </div>
        <div className="pbt-divider" />
        <div className="pbt-undo-group">
          <button className="pbt-icon-btn" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"/></svg>
          </button>
          <button className="pbt-icon-btn" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"/></svg>
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="pbt-right">
        <button className="pbt-btn pbt-btn--ghost" onClick={onPreview}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
          Preview
        </button>
        <button className="pbt-btn pbt-btn--secondary" onClick={onSave} disabled={saving || !hasChanges}>
          {saving ? <span className="pbt-spinner" /> : "Save"}
        </button>
        <button className="pbt-btn pbt-btn--primary" onClick={onPublish}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"/></svg>
          Publish
        </button>
      </div>
    </div>
  );
}

export const toolbarStyles = `
  .pbt-root { display: flex; align-items: center; justify-content: space-between; height: 48px; background: #0C0E16; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 0 12px; flex-shrink: 0; z-index: 100; }
  .pbt-left, .pbt-center, .pbt-right { display: flex; align-items: center; gap: 8px; }
  .pbt-back { width: 32px; height: 32px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748B; transition: all 0.15s; }
  .pbt-back svg { width: 16px; height: 16px; }
  .pbt-back:hover { background: rgba(255,255,255,0.08); color: #CBD5E1; }
  .pbt-logo { display: flex; align-items: center; gap: 6px; color: #10B981; font-size: 14px; font-weight: 800; font-family: 'Rubik', sans-serif; }
  .pbt-logo span { color: #CBD5E1; }
  .pbt-divider { width: 1px; height: 20px; background: rgba(255,255,255,0.08); margin: 0 4px; }
  .pbt-title-input { background: transparent; border: 1px solid transparent; border-radius: 4px; padding: 4px 8px; color: #CBD5E1; font-size: 13px; font-weight: 600; outline: none; width: 180px; font-family: inherit; }
  .pbt-title-input:hover { border-color: rgba(255,255,255,0.1); }
  .pbt-title-input:focus { border-color: #10B981; background: rgba(255,255,255,0.04); }

  .pbt-viewport-group { display: flex; gap: 2px; background: rgba(255,255,255,0.04); border-radius: 6px; padding: 2px; }
  .pbt-vp-btn { width: 30px; height: 28px; background: transparent; border: none; border-radius: 4px; color: #475569; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .pbt-vp-btn svg { width: 16px; height: 16px; }
  .pbt-vp-btn:hover { color: #94A3B8; }
  .pbt-vp-btn--active { background: rgba(16,185,129,0.15); color: #10B981; }
  .pbt-zoom-group { display: flex; align-items: center; gap: 4px; }
  .pbt-zoom-btn { width: 24px; height: 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; color: #64748B; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .pbt-zoom-btn:hover { background: rgba(255,255,255,0.08); color: #CBD5E1; }
  .pbt-zoom-label { font-size: 11px; color: #64748B; font-weight: 600; width: 36px; text-align: center; }
  .pbt-undo-group { display: flex; gap: 2px; }
  .pbt-icon-btn { width: 30px; height: 28px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; color: #64748B; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .pbt-icon-btn svg { width: 14px; height: 14px; }
  .pbt-icon-btn:hover:not(:disabled) { background: rgba(255,255,255,0.08); color: #CBD5E1; }
  .pbt-icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .pbt-btn { display: flex; align-items: center; gap: 6px; padding: 6px 16px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.15s; border: none; font-family: inherit; }
  .pbt-btn--ghost { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #94A3B8; }
  .pbt-btn--ghost:hover { background: rgba(255,255,255,0.04); color: #CBD5E1; }
  .pbt-btn--secondary { background: rgba(255,255,255,0.06); color: #CBD5E1; }
  .pbt-btn--secondary:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
  .pbt-btn--secondary:disabled { opacity: 0.4; cursor: not-allowed; }
  .pbt-btn--primary { background: linear-gradient(135deg, #10B981, #059669); color: #FFFFFF; box-shadow: 0 2px 8px rgba(16,185,129,0.3); }
  .pbt-btn--primary:hover { box-shadow: 0 4px 16px rgba(16,185,129,0.5); transform: translateY(-1px); }
  .pbt-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: pbt-spin 0.6s linear infinite; display: inline-block; }
  @keyframes pbt-spin { to { transform: rotate(360deg); } }
`;
