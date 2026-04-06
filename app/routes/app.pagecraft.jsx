import { useState, useCallback, useEffect, useMemo } from "react";
import { json } from "@remix-run/node";
import { useActionData, useSubmit } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { SECTION_DEFAULTS, generateId, getSectionMeta } from "../components/pagecraft/sectionRegistry";
import EditorToolbar, { toolbarStyles } from "../components/pagecraft/EditorToolbar";
import EditorSidebar, { sidebarStyles } from "../components/pagecraft/EditorSidebar";
import EditorCanvas, { canvasStyles } from "../components/pagecraft/EditorCanvas";
import SectionEditor, { inspectorStyles } from "../components/pagecraft/SectionEditor";
import AddSectionPanel, { addSectionStyles } from "../components/pagecraft/AddSectionPanel";
import DeployModal, { deployModalStyles } from "../components/pagecraft/DeployModal";

// ── Loader ──
export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({ ok: true });
};

// ── Action — Server-side AI generation + publish ──
export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const body = await request.json();
  const intent = body.intent;

  // AI Generate
  if (intent === "generate") {
    try {
      const res = await fetch(`https://${session.shop}/admin/api/2025-01/shop.json`, {
        headers: { "X-Shopify-Access-Token": session.accessToken },
      });
      const shopData = res.ok ? await res.json() : {};
      const storeName = shopData.shop?.name || body.storeName || "My Store";

      const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) return json({ error: "AI API key not configured" }, { status: 500 });

      const prompt = buildGenerationPrompt(body.niche, body.style, storeName, body.storeUrl, body.description);
      const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192, responseMimeType: "application/json" },
        }),
      });

      if (!aiRes.ok) {
        console.error("Gemini API error:", await aiRes.text());
        return json({ error: "AI generation failed" }, { status: 500 });
      }

      const aiData = await aiRes.json();
      const text = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) return json({ error: "Empty AI response" }, { status: 500 });

      const page = JSON.parse(text);
      return json({ intent: "generate", page, storeName });
    } catch (err) {
      console.error("Generate error:", err);
      return json({ error: err.message }, { status: 500 });
    }
  }

  // Publish
  if (intent === "publish") {
    try {
      const res = await fetch(new URL("/api/pagecraft-publish", request.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: request.headers.get("Cookie") || "" },
        body: JSON.stringify(body.payload),
      });
      const data = await res.json();
      if (!res.ok) return json({ error: data.error || "Publish failed" }, { status: 500 });
      return json({ intent: "publish", ...data });
    } catch (err) {
      console.error("Publish error:", err);
      return json({ error: err.message }, { status: 500 });
    }
  }

  return json({ error: "Unknown intent" }, { status: 400 });
};

// ── Generation Prompt ──
function buildGenerationPrompt(niche, style, storeName, storeUrl, description) {
  return `You are a world-class e-commerce page builder AI. Generate a complete, high-converting landing page for a ${niche || "general"} store named "${storeName}".

Style: ${style || "modern"} — use this to influence colors, tone, and layout.
Store URL: ${storeUrl || "N/A"}
Description: ${description || "A premium e-commerce store."}

Return ONLY valid JSON with this exact shape:
{
  "sections": [
    // Array of section objects. Each MUST have "type" and all relevant fields.
    // Available types: hero, product_showcase, trust_badges, social_proof, faq, urgency_bar, newsletter, announcement_bar, image_with_text, brand_logos, countdown_timer, cta_banner, footer
  ],
  "meta": {
    "page_title": "string",
    "page_description": "string"
  }
}

RULES:
- Start with announcement_bar or urgency_bar, then hero, then content sections, end with cta_banner + footer
- Include AT LEAST 8 sections for a complete page
- For hero: include headline, subtext, cta_text, cta_color (hex), background_color (hex)
- For product_showcase: include headline, subtext, columns (2-4), products array with name and price
- For trust_badges: include badges array with icon (shield|truck|refresh|star|check|lock|heart) and label
- For social_proof: include headline, reviews array with name, rating (1-5), text, location
- For faq: include headline, items array with question and answer
- For newsletter: include headline, subtext, placeholder, button_text, button_color
- For image_with_text: include headline, text, image_position (left|right), cta_text
- For brand_logos: include headline, logos array with name and text
- For countdown_timer: include headline, subtext, end_date (ISO format), accent_color
- For cta_banner: include headline, subtext, cta_text, cta_color
- For footer: include columns array with title and links array, plus copyright
- Use vibrant, on-brand colors — NO generic grays
- Write compelling, conversion-focused copy
- Make it feel premium and trustworthy`;
}

// ── Main Component ──
export default function PageCraftBuilder() {
  // Wizard state
  const [mode, setMode] = useState("wizard"); // "wizard" | "editor"
  const [wizardStep, setWizardStep] = useState(0);
  const [niche, setNiche] = useState("");
  const [style, setStyle] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  // Editor state
  const [sections, setSections] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [pageTitle, setPageTitle] = useState("My Landing Page");
  const [viewport, setViewport] = useState("desktop");
  const [score, setScore] = useState(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addInsertIndex, setAddInsertIndex] = useState(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState(null);
  const [regenerating, setRegenerating] = useState(false);

  // History (undo/redo)
  const [history, setHistory] = useState({ past: [], future: [] });

  const submit = useSubmit();
  const actionData = useActionData();

  const selectedSection = useMemo(
    () => sections.find((s) => s.id === selectedId) || null,
    [sections, selectedId]
  );

  // Handle action data
  useEffect(() => {
    if (!actionData) return;
    if (actionData.intent === "generate" && actionData.page) {
      const aiSections = (actionData.page.sections || []).map((s) => ({
        ...SECTION_DEFAULTS[s.type],
        ...s,
        id: generateId(),
        visible: true,
      }));
      setSections(aiSections);
      setPageTitle(actionData.page.meta?.page_title || `${actionData.storeName} - Home`);
      setMode("editor");
      setGenerating(false);
      setRegenerating(false);
      computeScore(aiSections);
    }
    if (actionData.intent === "publish") {
      setDeploying(false);
      setDeployResult(actionData);
    }
    if (actionData.error) {
      setGenError(actionData.error);
      setGenerating(false);
      setDeploying(false);
      setRegenerating(false);
    }
  }, [actionData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (mode !== "editor") return;
      if (e.ctrlKey && e.key === "z") { e.preventDefault(); handleUndo(); }
      if (e.ctrlKey && e.key === "y") { e.preventDefault(); handleRedo(); }
      if (e.key === "Delete" && selectedId) { handleDeleteSection(selectedId); }
      if (e.key === "Escape") { setSelectedId(null); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, selectedId, history]);

  // History helpers
  const pushHistory = useCallback((newSections) => {
    setHistory((prev) => {
      const newPast = [...prev.past, sections];
      if (newPast.length > 50) newPast.shift();
      return { past: newPast, future: [] };
    });
  }, [sections]);

  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      setSections(previous);
      return { past: prev.past.slice(0, -1), future: [sections, ...prev.future] };
    });
  }, [sections]);

  const handleRedo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      setSections(next);
      return { past: [...prev.past, sections], future: prev.future.slice(1) };
    });
  }, [sections]);

  // Score computation
  const computeScore = useCallback((secs) => {
    const types = secs.filter(s => s.visible).map(s => s.type);
    let sc = 0;
    if (types.includes("hero")) sc += 15;
    if (types.includes("product_showcase")) sc += 12;
    if (types.includes("trust_badges")) sc += 12;
    if (types.includes("social_proof")) sc += 15;
    if (types.includes("faq")) sc += 8;
    if (types.includes("urgency_bar") || types.includes("countdown_timer")) sc += 10;
    if (types.includes("newsletter")) sc += 8;
    if (types.includes("cta_banner")) sc += 8;
    if (types.includes("footer")) sc += 5;
    if (types.length >= 8) sc += 7;
    setScore(Math.min(100, sc));
  }, []);

  // Section operations
  const handleSectionChange = useCallback((id, partialUpdate) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...partialUpdate } : s)));
  }, []);

  const handleReorder = useCallback((fromIdx, toIdx) => {
    pushHistory();
    setSections((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, [pushHistory]);

  const handleToggleVisibility = useCallback((id) => {
    pushHistory();
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
  }, [pushHistory]);

  const handleDuplicateSection = useCallback((id) => {
    pushHistory();
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const clone = { ...prev[idx], id: generateId() };
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
  }, [pushHistory]);

  const handleDeleteSection = useCallback((id) => {
    pushHistory();
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [pushHistory, selectedId]);

  const handleAddSection = useCallback((section, insertAt) => {
    pushHistory();
    setSections((prev) => {
      const next = [...prev];
      const idx = insertAt != null ? insertAt : next.length;
      next.splice(idx, 0, section);
      return next;
    });
    setSelectedId(section.id);
    computeScore([...sections, section]);
  }, [pushHistory, sections, computeScore]);

  const handleInlineEdit = useCallback((id, field, value) => {
    pushHistory();
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }, [pushHistory]);

  // Generate
  const handleGenerate = useCallback(() => {
    setGenerating(true);
    setGenError("");
    submit(
      { intent: "generate", niche, style, storeName, storeUrl, description },
      { method: "post", encType: "application/json" }
    );
  }, [niche, style, storeName, storeUrl, description, submit]);

  // Regenerate
  const handleAiRegenerate = useCallback(() => {
    setRegenerating(true);
    submit(
      { intent: "generate", niche, style, storeName, storeUrl, description },
      { method: "post", encType: "application/json" }
    );
  }, [niche, style, storeName, storeUrl, description, submit]);

  // Deploy
  const handleDeploy = useCallback(async ({ title, metaDesc }) => {
    setDeploying(true);
    const whatsappSec = sections.find((s) => s.type === "whatsapp_widget" && s.visible);
    submit(
      {
        intent: "publish",
        payload: {
          page: { sections: sections.filter(s => s.visible), meta: { page_title: title, page_description: metaDesc } },
          storeName,
          whatsapp: whatsappSec?.phone || "",
        },
      },
      { method: "post", encType: "application/json" }
    );
  }, [sections, storeName, submit]);

  // ── Wizard Mode ──
  if (mode === "wizard") {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: wizardStyles }} />
        <div className="pcw-root">
          <div className="pcw-bg-grid" />
          <div className="pcw-container">
            {/* Logo */}
            <div className="pcw-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>
              <span>PageCraft AI</span>
            </div>

            {/* Progress */}
            <div className="pcw-progress">
              {["Niche", "Style", "Details"].map((label, i) => (
                <div key={i} className={`pcw-step ${i <= wizardStep ? "pcw-step--done" : ""} ${i === wizardStep ? "pcw-step--active" : ""}`}>
                  <div className="pcw-step-dot">{i < wizardStep ? "✓" : i + 1}</div>
                  <span className="pcw-step-label">{label}</span>
                </div>
              ))}
            </div>

            {/* Step 0: Niche */}
            {wizardStep === 0 && (
              <div className="pcw-card">
                <h2 className="pcw-heading">What's your niche?</h2>
                <p className="pcw-subtext">Select a niche to generate tailored content and design</p>
                <div className="pcw-niche-grid">
                  {NICHES.map((n) => (
                    <button key={n.id} className={`pcw-niche-btn ${niche === n.id ? "pcw-niche-btn--active" : ""}`} onClick={() => setNiche(n.id)}>
                      <span className="pcw-niche-icon">{n.icon}</span>
                      <span className="pcw-niche-name">{n.label}</span>
                    </button>
                  ))}
                </div>
                <button className="pcw-next-btn" onClick={() => wizardStep < 2 && setWizardStep(1)} disabled={!niche}>
                  Continue
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </button>
              </div>
            )}

            {/* Step 1: Style */}
            {wizardStep === 1 && (
              <div className="pcw-card">
                <h2 className="pcw-heading">Choose your style</h2>
                <p className="pcw-subtext">This will guide colors, fonts, and overall aesthetic</p>
                <div className="pcw-style-grid">
                  {STYLES.map((s) => (
                    <button key={s.id} className={`pcw-style-btn ${style === s.id ? "pcw-style-btn--active" : ""}`} onClick={() => setStyle(s.id)}>
                      <div className="pcw-style-preview" style={{ background: s.gradient }} />
                      <span className="pcw-style-name">{s.label}</span>
                    </button>
                  ))}
                </div>
                <div className="pcw-btn-row">
                  <button className="pcw-back-btn" onClick={() => setWizardStep(0)}>Back</button>
                  <button className="pcw-next-btn" onClick={() => setWizardStep(2)} disabled={!style}>
                    Continue
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details + Generate */}
            {wizardStep === 2 && (
              <div className="pcw-card">
                <h2 className="pcw-heading">Tell us about your store</h2>
                <p className="pcw-subtext">This helps AI write better copy for your page</p>
                <div className="pcw-form">
                  <div className="pcw-field">
                    <label className="pcw-label">Store Name</label>
                    <input className="pcw-input" placeholder="e.g. GlowUp Skincare" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                  </div>
                  <div className="pcw-field">
                    <label className="pcw-label">Store URL (optional)</label>
                    <input className="pcw-input" placeholder="e.g. mystore.myshopify.com" value={storeUrl} onChange={(e) => setStoreUrl(e.target.value)} />
                  </div>
                  <div className="pcw-field">
                    <label className="pcw-label">Brief Description</label>
                    <textarea className="pcw-textarea" placeholder="What do you sell? Who is your target customer?" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                </div>
                {genError && <div className="pcw-error">{genError}</div>}
                <div className="pcw-btn-row">
                  <button className="pcw-back-btn" onClick={() => setWizardStep(1)}>Back</button>
                  <button className="pcw-generate-btn" onClick={handleGenerate} disabled={generating || !storeName}>
                    {generating ? (
                      <><span className="pcw-spinner" /> Generating with AI...</>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                        Generate My Page
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── Editor Mode ──
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&family=Nunito+Sans:wght@400;600;700;800&display=swap');
        ${toolbarStyles} ${sidebarStyles} ${canvasStyles} ${inspectorStyles} ${addSectionStyles} ${deployModalStyles} ${editorRootStyles}
      `}} />
      <div className="pce-root">
        <EditorToolbar
          pageTitle={pageTitle}
          onTitleChange={setPageTitle}
          canUndo={history.past.length > 0}
          canRedo={history.future.length > 0}
          onUndo={handleUndo}
          onRedo={handleRedo}
          viewport={viewport}
          onViewportChange={setViewport}
          score={score}
          onAiRegenerate={handleAiRegenerate}
          regenerating={regenerating}
          onDeploy={() => { setDeployResult(null); setShowDeployModal(true); }}
          onBack={() => setMode("wizard")}
        />
        <div className="pce-body">
          <EditorSidebar
            sections={sections}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onReorder={handleReorder}
            onToggleVisibility={handleToggleVisibility}
            onDuplicate={handleDuplicateSection}
            onDelete={handleDeleteSection}
            onAddSection={() => { setAddInsertIndex(null); setShowAddPanel(true); }}
          />
          <EditorCanvas
            sections={sections}
            selectedId={selectedId}
            viewport={viewport}
            onSelect={setSelectedId}
            onReorder={handleReorder}
            onInlineEdit={handleInlineEdit}
            onAddBetween={(idx) => { setAddInsertIndex(idx); setShowAddPanel(true); }}
          />
          <SectionEditor
            section={selectedSection}
            onChange={handleSectionChange}
            onDelete={handleDeleteSection}
            onDuplicate={handleDuplicateSection}
            onClose={() => setSelectedId(null)}
          />
        </div>
      </div>

      {showAddPanel && (
        <AddSectionPanel
          onAdd={handleAddSection}
          onClose={() => setShowAddPanel(false)}
          insertIndex={addInsertIndex}
        />
      )}

      {showDeployModal && (
        <DeployModal
          onClose={() => setShowDeployModal(false)}
          onDeploy={handleDeploy}
          pageTitle={pageTitle}
          score={score}
          sections={sections}
          deploying={deploying}
          deployResult={deployResult}
        />
      )}
    </>
  );
}

// ── Wizard Data ──
const NICHES = [
  { id: "skincare", icon: "✨", label: "Skincare & Beauty" },
  { id: "fashion", icon: "👗", label: "Fashion & Apparel" },
  { id: "fitness", icon: "💪", label: "Fitness & Health" },
  { id: "electronics", icon: "📱", label: "Electronics & Gadgets" },
  { id: "food", icon: "🍽️", label: "Food & Beverages" },
  { id: "home", icon: "🏠", label: "Home & Living" },
  { id: "pets", icon: "🐾", label: "Pets & Animals" },
  { id: "jewelry", icon: "💍", label: "Jewelry & Accessories" },
  { id: "kids", icon: "🧸", label: "Kids & Baby" },
  { id: "sports", icon: "⚽", label: "Sports & Outdoors" },
  { id: "books", icon: "📚", label: "Books & Education" },
  { id: "general", icon: "🛒", label: "General Store" },
];

const STYLES = [
  { id: "modern", label: "Modern", gradient: "linear-gradient(135deg, #0F172A, #1E293B)" },
  { id: "minimalist", label: "Minimalist", gradient: "linear-gradient(135deg, #F8FAFC, #CBD5E1)" },
  { id: "bold", label: "Bold", gradient: "linear-gradient(135deg, #DC2626, #9333EA)" },
  { id: "elegant", label: "Elegant", gradient: "linear-gradient(135deg, #1C1917, #D4A574)" },
  { id: "playful", label: "Playful", gradient: "linear-gradient(135deg, #F97316, #EC4899)" },
  { id: "nature", label: "Nature", gradient: "linear-gradient(135deg, #064E3B, #34D399)" },
  { id: "luxury", label: "Luxury", gradient: "linear-gradient(135deg, #0C0A09, #B8860B)" },
  { id: "tech", label: "Tech", gradient: "linear-gradient(135deg, #0C4A6E, #38BDF8)" },
];

// ── Styles ──
const editorRootStyles = `
  .pce-root { width: 100vw; height: 100vh; display: flex; flex-direction: column; position: fixed; inset: 0; z-index: 999; background: #0C1021; font-family: 'Nunito Sans', sans-serif; }
  .pce-body { display: flex; flex: 1; overflow: hidden; }
`;

const wizardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&family=Nunito+Sans:wght@400;600;700;800&display=swap');
  .pcw-root { width: 100vw; height: 100vh; position: fixed; inset: 0; z-index: 999; background: #06080F; display: flex; align-items: center; justify-content: center; font-family: 'Nunito Sans', sans-serif; overflow: auto; }
  .pcw-bg-grid { position: absolute; inset: 0; background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0); background-size: 40px 40px; pointer-events: none; }
  .pcw-container { position: relative; z-index: 2; width: 100%; max-width: 560px; padding: 32px 24px; display: flex; flex-direction: column; align-items: center; gap: 24px; }

  .pcw-logo { display: flex; align-items: center; gap: 8px; color: #10B981; font-family: 'Rubik', sans-serif; font-size: 20px; font-weight: 800; }
  .pcw-logo span { color: #fff; }

  .pcw-progress { display: flex; gap: 32px; align-items: center; }
  .pcw-step { display: flex; align-items: center; gap: 8px; }
  .pcw-step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; background: #1E293B; color: #475569; transition: all 0.3s; }
  .pcw-step--active .pcw-step-dot { background: #10B981; color: #fff; box-shadow: 0 0 16px rgba(16,185,129,0.4); }
  .pcw-step--done .pcw-step-dot { background: rgba(16,185,129,0.15); color: #10B981; }
  .pcw-step-label { font-size: 12px; font-weight: 600; color: #475569; }
  .pcw-step--active .pcw-step-label { color: #CBD5E1; }

  .pcw-card { width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 28px; display: flex; flex-direction: column; gap: 20px; }
  .pcw-heading { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin: 0; text-align: center; }
  .pcw-subtext { font-size: 14px; color: #64748B; margin: 0; text-align: center; }

  .pcw-niche-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .pcw-niche-btn { background: #0F1524; border: 1.5px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px 8px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; transition: all 0.15s; }
  .pcw-niche-btn:hover { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.04); }
  .pcw-niche-btn--active { border-color: #10B981 !important; background: rgba(16,185,129,0.1) !important; box-shadow: 0 0 12px rgba(16,185,129,0.15); }
  .pcw-niche-icon { font-size: 22px; }
  .pcw-niche-name { font-size: 11px; font-weight: 600; color: #94A3B8; text-align: center; }
  .pcw-niche-btn--active .pcw-niche-name { color: #10B981; }

  .pcw-style-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .pcw-style-btn { background: #0F1524; border: 1.5px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 8px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.15s; }
  .pcw-style-btn:hover { border-color: rgba(16,185,129,0.3); }
  .pcw-style-btn--active { border-color: #10B981 !important; box-shadow: 0 0 12px rgba(16,185,129,0.15); }
  .pcw-style-preview { width: 100%; height: 56px; border-radius: 6px; }
  .pcw-style-name { font-size: 11px; font-weight: 600; color: #94A3B8; }
  .pcw-style-btn--active .pcw-style-name { color: #10B981; }

  .pcw-form { display: flex; flex-direction: column; gap: 14px; }
  .pcw-field { display: flex; flex-direction: column; gap: 4px; }
  .pcw-label { font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.06em; }
  .pcw-input, .pcw-textarea { width: 100%; padding: 10px 14px; background: #0F1524; border: 1.5px solid #1E293B; border-radius: 8px; color: #fff; font-size: 13px; font-family: 'Nunito Sans', sans-serif; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
  .pcw-input:focus, .pcw-textarea:focus { border-color: #10B981; }
  .pcw-textarea { resize: vertical; min-height: 60px; }

  .pcw-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #FCA5A5; font-size: 13px; padding: 10px 14px; border-radius: 8px; }

  .pcw-btn-row { display: flex; gap: 8px; justify-content: flex-end; }
  .pcw-back-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #94A3B8; padding: 10px 22px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: 'Nunito Sans', sans-serif; }
  .pcw-back-btn:hover { background: rgba(255,255,255,0.08); }
  .pcw-next-btn { display: flex; align-items: center; gap: 6px; background: #10B981; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: 'Nunito Sans', sans-serif; margin-left: auto; }
  .pcw-next-btn:hover:not(:disabled) { box-shadow: 0 4px 16px rgba(16,185,129,0.4); transform: translateY(-1px); }
  .pcw-next-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .pcw-generate-btn { display: flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #10B981, #059669); color: #fff; border: none; padding: 12px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: 'Nunito Sans', sans-serif; }
  .pcw-generate-btn:hover:not(:disabled) { box-shadow: 0 4px 20px rgba(16,185,129,0.5); transform: translateY(-1px); }
  .pcw-generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .pcw-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: pcw-spin 0.6s linear infinite; display: inline-block; }
  @keyframes pcw-spin { to { transform: rotate(360deg); } }
`;
