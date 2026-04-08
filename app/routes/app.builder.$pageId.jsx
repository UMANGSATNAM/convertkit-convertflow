import { json, redirect } from "@remix-run/node";
import { useLoaderData, useFetcher, useNavigate } from "@remix-run/react";
import { useState, useCallback, useEffect, useRef } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { SECTION_TYPES, SECTION_DEFAULTS, SECTION_CATEGORIES, getSectionMeta, generateId } from "../components/pagecraft/sectionRegistry";

// ── Loader: fetch page data ──
export const loader = async ({ params, request }) => {
  const { session } = await authenticate.admin(request);
  const shopRecord = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shopRecord) return redirect("/app/builder");

  const page = await prisma.page.findFirst({
    where: { id: params.pageId, shopId: shopRecord.id },
  });
  if (!page) return redirect("/app/builder");

  return json({
    page: {
      ...page,
      content: page.content ? JSON.parse(page.content) : [],
      globalStyles: page.globalStyles ? JSON.parse(page.globalStyles) : { fonts: {}, colors: {} },
    },
    shop: session.shop,
  });
};

// ── Action: save / publish ──
export const action = async ({ params, request }) => {
  const { session } = await authenticate.admin(request);
  const body = await request.json();
  const { intent, sections, globalStyles, title, seoTitle, seoDescription, slug } = body;

  if (intent === "save") {
    const data = {};
    if (sections !== undefined) data.content = JSON.stringify(sections);
    if (globalStyles !== undefined) data.globalStyles = JSON.stringify(globalStyles);
    if (title !== undefined) data.title = title;
    if (seoTitle !== undefined) data.seoTitle = seoTitle;
    if (seoDescription !== undefined) data.seoDescription = seoDescription;
    if (slug !== undefined) data.slug = slug;

    await prisma.page.update({ where: { id: params.pageId }, data });
    return json({ success: true, saved: true });
  }

  if (intent === "publish") {
    // Trigger the publish API
    const page = await prisma.page.findUnique({ where: { id: params.pageId } });
    if (!page) return json({ error: "Page not found" }, { status: 404 });

    const sections_ = page.content ? JSON.parse(page.content) : [];
    const globalStyles_ = page.globalStyles ? JSON.parse(page.globalStyles) : {};

    // Import block-to-html dynamically
    const { blockToHtml } = await import("../lib/block-to-html.server");
    const bodyHtml = blockToHtml(sections_, globalStyles_);

    const shopifyPayload = {
      page: {
        title: page.seoTitle || page.title,
        body_html: bodyHtml,
        handle: page.slug,
        published: true,
      },
    };

    let shopifyPage;
    const headers = {
      "X-Shopify-Access-Token": session.accessToken,
      "Content-Type": "application/json",
    };

    if (page.shopifyPageId) {
      const res = await fetch(`https://${session.shop}/admin/api/2025-01/pages/${page.shopifyPageId}.json`, {
        method: "PUT", headers, body: JSON.stringify(shopifyPayload),
      });
      if (!res.ok) return json({ error: "Shopify update failed" }, { status: 500 });
      shopifyPage = (await res.json()).page;
    } else {
      const res = await fetch(`https://${session.shop}/admin/api/2025-01/pages.json`, {
        method: "POST", headers, body: JSON.stringify(shopifyPayload),
      });
      if (!res.ok) return json({ error: "Shopify create failed" }, { status: 500 });
      shopifyPage = (await res.json()).page;
    }

    await prisma.page.update({
      where: { id: params.pageId },
      data: { shopifyPageId: String(shopifyPage.id), status: "published", publishedAt: new Date() },
    });

    return json({ success: true, published: true, pageUrl: `https://${session.shop}/pages/${page.slug}` });
  }

  return json({ error: "Unknown intent" }, { status: 400 });
};

// ── Editor Component ──
export default function BuilderEditor() {
  const { page, shop } = useLoaderData();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const [sections, setSections] = useState(page.content || []);
  const [globalStyles, setGlobalStyles] = useState(page.globalStyles || { fonts: {}, colors: {} });
  const [selectedId, setSelectedId] = useState(null);
  const [activePanel, setActivePanel] = useState("sections"); // sections | settings | seo | styles
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addCategory, setAddCategory] = useState("all");
  const [viewport, setViewport] = useState("desktop"); // desktop | tablet | mobile
  const [pageTitle, setPageTitle] = useState(page.title);
  const [seoTitle, setSeoTitle] = useState(page.seoTitle || "");
  const [seoDesc, setSeoDesc] = useState(page.seoDescription || "");
  const [saved, setSaved] = useState(true);
  const [publishResult, setPublishResult] = useState(null);
  const [dragIdx, setDragIdx] = useState(null);

  const autoSaveTimer = useRef(null);

  const selected = sections.find((s) => s.id === selectedId) || null;

  // Auto-save
  useEffect(() => {
    if (saved) return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      fetcher.submit(
        JSON.stringify({ intent: "save", sections, globalStyles, title: pageTitle }),
        { method: "POST", encType: "application/json" }
      );
      setSaved(true);
    }, 2000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [sections, globalStyles, pageTitle, saved]);

  const markDirty = useCallback(() => setSaved(false), []);

  // Section CRUD
  const addSection = useCallback((type) => {
    const defaults = SECTION_DEFAULTS[type] || { type };
    const newSection = { ...defaults, id: generateId(), visible: true };
    setSections((prev) => [...prev, newSection]);
    setSelectedId(newSection.id);
    setShowAddPanel(false);
    markDirty();
  }, [markDirty]);

  const updateSection = useCallback((id, updates) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, ...updates } : s));
    markDirty();
  }, [markDirty]);

  const deleteSection = useCallback((id) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(null);
    markDirty();
  }, [selectedId, markDirty]);

  const duplicateSection = useCallback((id) => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const clone = { ...JSON.parse(JSON.stringify(prev[idx])), id: generateId() };
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
    markDirty();
  }, [markDirty]);

  const moveSection = useCallback((id, dir) => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
    markDirty();
  }, [markDirty]);

  const toggleVisibility = useCallback((id) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, visible: !s.visible } : s));
    markDirty();
  }, [markDirty]);

  // Save & Publish
  const handleSave = useCallback(() => {
    fetcher.submit(
      JSON.stringify({ intent: "save", sections, globalStyles, title: pageTitle, seoTitle, seoDescription: seoDesc }),
      { method: "POST", encType: "application/json" }
    );
    setSaved(true);
  }, [sections, globalStyles, pageTitle, seoTitle, seoDesc, fetcher]);

  const handlePublish = useCallback(() => {
    handleSave();
    setTimeout(() => {
      fetcher.submit(
        JSON.stringify({ intent: "publish" }),
        { method: "POST", encType: "application/json" }
      );
    }, 500);
  }, [handleSave, fetcher]);

  useEffect(() => {
    if (fetcher.data?.published) {
      setPublishResult(fetcher.data);
    }
  }, [fetcher.data]);

  // Viewport widths
  const viewportWidth = { desktop: "100%", tablet: "768px", mobile: "375px" }[viewport];

  const filteredSectionTypes = addCategory === "all"
    ? Object.entries(SECTION_TYPES)
    : Object.entries(SECTION_TYPES).filter(([, meta]) => meta.category === addCategory);

  return (
    <div style={styles.root}>
      {/* ── Top Toolbar ── */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <button onClick={() => navigate("/app/builder")} style={styles.backBtn}>
            ← Back
          </button>
          <div style={styles.divider} />
          <input
            value={pageTitle}
            onChange={(e) => { setPageTitle(e.target.value); markDirty(); }}
            style={styles.titleInput}
          />
          <span style={styles.saveStatus}>
            {fetcher.state === "submitting" ? "Saving..." : saved ? "✓ Saved" : "● Unsaved"}
          </span>
        </div>
        <div style={styles.toolbarCenter}>
          {["desktop", "tablet", "mobile"].map((v) => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              style={{ ...styles.viewportBtn, ...(viewport === v ? styles.viewportActive : {}) }}
            >
              {v === "desktop" ? "🖥" : v === "tablet" ? "📱" : "📲"}
            </button>
          ))}
        </div>
        <div style={styles.toolbarRight}>
          <button onClick={handleSave} style={styles.saveBtn} disabled={fetcher.state === "submitting"}>
            💾 Save
          </button>
          <button onClick={handlePublish} style={styles.publishBtn} disabled={fetcher.state === "submitting"}>
            🚀 Publish
          </button>
        </div>
      </div>

      {/* ── Publish Success Toast ── */}
      {publishResult?.published && (
        <div style={styles.toast}>
          ✅ Published!{" "}
          <a href={publishResult.pageUrl} target="_blank" rel="noreferrer" style={styles.toastLink}>
            View Live →
          </a>
          <button onClick={() => setPublishResult(null)} style={styles.toastClose}>✕</button>
        </div>
      )}

      <div style={styles.body}>
        {/* ── Left Panel: Section List ── */}
        <div style={styles.leftPanel}>
          <div style={styles.panelTabs}>
            {[
              { id: "sections", icon: "📑", label: "Sections" },
              { id: "styles", icon: "🎨", label: "Styles" },
              { id: "seo", icon: "🔍", label: "SEO" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id)}
                style={{ ...styles.panelTab, ...(activePanel === tab.id ? styles.panelTabActive : {}) }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {activePanel === "sections" && (
            <div style={styles.sectionList}>
              {sections.map((sec, idx) => {
                const meta = getSectionMeta(sec.type);
                const isSelected = sec.id === selectedId;
                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedId(sec.id)}
                    style={{
                      ...styles.sectionItem,
                      ...(isSelected ? styles.sectionItemActive : {}),
                      opacity: sec.visible === false ? 0.4 : 1,
                    }}
                  >
                    <div style={styles.sectionItemLeft}>
                      <span style={styles.sectionIcon}>{meta.icon}</span>
                      <div>
                        <div style={styles.sectionLabel}>{meta.label}</div>
                        <div style={styles.sectionType}>{sec.headline || sec.message || meta.desc}</div>
                      </div>
                    </div>
                    <div style={styles.sectionActions}>
                      <button onClick={(e) => { e.stopPropagation(); moveSection(sec.id, "up"); }} style={styles.microBtn} disabled={idx === 0}>↑</button>
                      <button onClick={(e) => { e.stopPropagation(); moveSection(sec.id, "down"); }} style={styles.microBtn} disabled={idx === sections.length - 1}>↓</button>
                      <button onClick={(e) => { e.stopPropagation(); toggleVisibility(sec.id); }} style={styles.microBtn}>{sec.visible !== false ? "👁" : "🚫"}</button>
                      <button onClick={(e) => { e.stopPropagation(); duplicateSection(sec.id); }} style={styles.microBtn}>📋</button>
                      <button onClick={(e) => { e.stopPropagation(); deleteSection(sec.id); }} style={{ ...styles.microBtn, color: "#EF4444" }}>🗑</button>
                    </div>
                  </div>
                );
              })}

              <button onClick={() => setShowAddPanel(true)} style={styles.addSectionBtn}>
                + Add Section
              </button>
            </div>
          )}

          {activePanel === "styles" && (
            <div style={styles.stylePanel}>
              <div style={styles.styleSectionTitle}>Colors</div>
              {["primary", "secondary", "background", "surface", "text", "muted", "accent"].map((key) => (
                <div key={key} style={styles.colorRow}>
                  <label style={styles.colorLabel}>{key}</label>
                  <input
                    type="color"
                    value={globalStyles.colors?.[key] || "#000000"}
                    onChange={(e) => {
                      setGlobalStyles((prev) => ({
                        ...prev,
                        colors: { ...prev.colors, [key]: e.target.value },
                      }));
                      markDirty();
                    }}
                    style={styles.colorInput}
                  />
                  <span style={styles.colorHex}>{globalStyles.colors?.[key] || "#000"}</span>
                </div>
              ))}

              <div style={{ ...styles.styleSectionTitle, marginTop: 24 }}>Fonts</div>
              {["heading", "body"].map((key) => (
                <div key={key} style={styles.fontRow}>
                  <label style={styles.colorLabel}>{key}</label>
                  <select
                    value={globalStyles.fonts?.[key] || "Inter"}
                    onChange={(e) => {
                      setGlobalStyles((prev) => ({
                        ...prev,
                        fonts: { ...prev.fonts, [key]: e.target.value },
                      }));
                      markDirty();
                    }}
                    style={styles.fontSelect}
                  >
                    {["Inter", "Playfair Display", "Syne", "Cormorant Garamond", "Bebas Neue", "Outfit", "DM Sans", "Nunito", "Barlow", "Roboto", "Poppins", "Montserrat"].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {activePanel === "seo" && (
            <div style={styles.stylePanel}>
              <div style={styles.styleSectionTitle}>Page SEO</div>
              <div style={styles.seoField}>
                <label style={styles.colorLabel}>SEO Title</label>
                <input
                  value={seoTitle}
                  onChange={(e) => { setSeoTitle(e.target.value); markDirty(); }}
                  placeholder="Page title for search engines"
                  style={styles.seoInput}
                />
              </div>
              <div style={styles.seoField}>
                <label style={styles.colorLabel}>Meta Description</label>
                <textarea
                  value={seoDesc}
                  onChange={(e) => { setSeoDesc(e.target.value); markDirty(); }}
                  placeholder="Page description for search engines"
                  rows={3}
                  style={styles.seoTextarea}
                />
              </div>
              <div style={styles.seoField}>
                <label style={styles.colorLabel}>URL Slug</label>
                <input
                  value={page.slug}
                  disabled
                  style={{ ...styles.seoInput, opacity: 0.6 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Canvas ── */}
        <div style={styles.canvas}>
          <div style={{ ...styles.canvasViewport, maxWidth: viewportWidth }}>
            {sections.length === 0 ? (
              <div style={styles.emptyCanvas}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎨</div>
                <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Start Building</div>
                <div style={{ color: "#6B7280", marginBottom: 24 }}>Add your first section to begin designing</div>
                <button onClick={() => setShowAddPanel(true)} style={styles.publishBtn}>+ Add Section</button>
              </div>
            ) : (
              sections.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => setSelectedId(sec.id)}
                  style={{
                    ...styles.canvasSection,
                    ...(sec.id === selectedId ? styles.canvasSectionSelected : {}),
                    opacity: sec.visible === false ? 0.3 : 1,
                  }}
                >
                  {sec.id === selectedId && (
                    <div style={styles.sectionOverlayLabel}>
                      {getSectionMeta(sec.type).icon} {getSectionMeta(sec.type).label}
                    </div>
                  )}
                  <SectionPreview section={sec} globalStyles={globalStyles} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Right Panel: Section Editor ── */}
        <div style={styles.rightPanel}>
          {selected ? (
            <SectionSettings
              section={selected}
              onUpdate={(updates) => updateSection(selected.id, updates)}
            />
          ) : (
            <div style={styles.noSelection}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👈</div>
              <div style={{ fontWeight: 600 }}>Select a section</div>
              <div style={{ color: "#6B7280", fontSize: 13 }}>Click a section in the canvas or list to edit</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Section Modal ── */}
      {showAddPanel && (
        <div style={styles.modalOverlay} onClick={() => setShowAddPanel(false)}>
          <div style={styles.addModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.addModalHeader}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Add Section</span>
              <button onClick={() => setShowAddPanel(false)} style={styles.closeBtn}>✕</button>
            </div>
            <div style={styles.addCatRow}>
              {SECTION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setAddCategory(cat.id)}
                  style={{ ...styles.catBtn, ...(addCategory === cat.id ? styles.catBtnActive : {}) }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div style={styles.addGrid}>
              {filteredSectionTypes.map(([type, meta]) => (
                <div key={type} onClick={() => addSection(type)} style={styles.addCard}>
                  <div style={styles.addCardIcon}>{meta.icon}</div>
                  <div style={styles.addCardLabel}>{meta.label}</div>
                  <div style={styles.addCardDesc}>{meta.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Section Preview (Canvas Renderer) ──
function SectionPreview({ section, globalStyles }) {
  const s = section;
  const colors = globalStyles.colors || {};
  const fonts = globalStyles.fonts || {};
  const headingFont = fonts.heading || "Inter";
  const bodyFont = fonts.body || "Inter";

  switch (s.type) {
    case "announcement_bar":
      return (
        <div style={{ background: s.background_color || "#1E293B", color: s.text_color || "#fff", padding: "10px 20px", textAlign: "center", fontSize: 13, fontWeight: 500 }}>
          {s.message || (s.messages || [])[0] || "Announcement text here"}
        </div>
      );

    case "hero":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 360, background: s.background_color || "#0F172A", color: s.text_color || "#fff" }}>
          <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {s.badge_text && <div style={{ fontSize: 11, letterSpacing: ".08em", color: colors.primary || "#10B981", marginBottom: 16, textTransform: "uppercase" }}>{s.badge_text}</div>}
            <div style={{ fontFamily: `'${headingFont}', serif`, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 14 }}>
              {(s.headline || "Your Headline").split("\n").map((l, i) => <span key={i}>{l}<br /></span>)}
            </div>
            {s.subtext && <div style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.7, maxWidth: 360, marginBottom: 24 }}>{s.subtext}</div>}
            {s.cta_text && <div><span style={{ display: "inline-block", background: s.cta_color || "#10B981", color: "#fff", padding: "12px 32px", fontSize: 13, fontWeight: 600 }}>{s.cta_text}</span></div>}
          </div>
          <div style={{ background: s.image_bg_gradient || s.image_bg_color || "#1E293B", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "#64748B" }}>
              {s.image_label && <div style={{ fontFamily: `'${headingFont}', serif`, fontSize: 20 }}>{s.image_label}</div>}
              {s.image_sublabel && <div style={{ fontSize: 11, letterSpacing: ".1em", marginTop: 4 }}>{s.image_sublabel}</div>}
              {!s.image_label && <div style={{ fontSize: 48 }}>🖼️</div>}
            </div>
          </div>
        </div>
      );

    case "trust_badges":
      return (
        <div style={{ background: s.background_color || "#1E293B", padding: "16px 24px", display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {(s.badges || []).map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: s.text_color || "#fff", fontSize: 12 }}>
              <span>{b.icon}</span>
              <span style={{ opacity: 0.7 }}><strong style={{ opacity: 1 }}>{b.number || ""}</strong> {b.label}</span>
            </div>
          ))}
        </div>
      );

    case "product_showcase":
      return (
        <div style={{ padding: "48px 32px", background: s.background_color || "#fff" }}>
          {s.kicker && <div style={{ fontSize: 11, letterSpacing: ".12em", color: colors.primary || "#10B981", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>{s.kicker}</div>}
          <div style={{ fontFamily: `'${headingFont}', serif`, fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{s.headline || "Products"}</div>
          {s.subtext && <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 32 }}>{s.subtext}</div>}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${s.columns || 3}, 1fr)`, gap: 16 }}>
            {(s.products || []).slice(0, 4).map((p, i) => (
              <div key={i} style={{ border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ height: 120, background: p.gradient || "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{p.variant}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 6 }}>{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "image_with_text":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, padding: "48px 32px", background: s.background_color || "#F8FAFC" }}>
          <div>
            {s.kicker && <div style={{ fontSize: 11, letterSpacing: ".12em", color: colors.primary || "#10B981", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>{s.kicker}</div>}
            <div style={{ fontFamily: `'${headingFont}', serif`, fontSize: 28, fontWeight: 700, marginBottom: 12 }}>{s.headline || "Section Title"}</div>
            {s.text && <div style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>{s.text}</div>}
            {s.features_grid && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
                {s.features_grid.slice(0, 4).map((f, i) => (
                  <div key={i} style={{ padding: 12, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 6 }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{f.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{f.title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ background: s.image_bg_gradient || "#E5E7EB", borderRadius: 8, minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {s.image_label ? <span style={{ fontFamily: `'${headingFont}', serif`, fontSize: 28, color: colors.primary }}>{s.image_label}</span> : <span style={{ fontSize: 48 }}>🖼️</span>}
          </div>
        </div>
      );

    case "social_proof":
      return (
        <div style={{ padding: "48px 32px", background: s.background_color || "#fff" }}>
          {s.kicker && <div style={{ fontSize: 11, letterSpacing: ".12em", color: colors.primary || "#10B981", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>{s.kicker}</div>}
          <div style={{ fontFamily: `'${headingFont}', serif`, fontSize: 28, fontWeight: 700, marginBottom: 24 }}>{s.headline || "Reviews"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {(s.reviews || []).slice(0, 3).map((r, i) => (
              <div key={i} style={{ padding: 20, border: "1px solid #E5E7EB", borderRadius: 8, background: "#fff" }}>
                <div style={{ color: colors.primary || "#FBBF24", fontSize: 12, letterSpacing: 1, marginBottom: 8 }}>{"★".repeat(r.rating || 5)}</div>
                <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6, marginBottom: 12 }}>{r.text?.slice(0, 100)}...</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{r.name} <span style={{ color: "#9CA3AF", fontWeight: 400 }}>· {r.location}</span></div>
              </div>
            ))}
          </div>
        </div>
      );

    case "faq":
      return (
        <div style={{ padding: "48px 32px", background: s.background_color || "#fff" }}>
          <div style={{ fontFamily: `'${headingFont}', serif`, fontSize: 28, fontWeight: 700, marginBottom: 24 }}>{s.headline || "FAQ"}</div>
          {(s.items || []).slice(0, 4).map((item, i) => (
            <div key={i} style={{ borderBottom: "1px solid #E5E7EB", padding: "14px 0" }}>
              <div style={{ fontSize: 14, fontWeight: 500, display: "flex", justifyContent: "space-between" }}>
                {item.question} <span style={{ color: colors.primary || "#10B981" }}>+</span>
              </div>
            </div>
          ))}
        </div>
      );

    case "cta_banner":
      return (
        <div style={{ padding: "48px 32px", background: s.background_color || "#10B981", color: s.text_color || "#fff", textAlign: "center" }}>
          <div style={{ fontFamily: `'${headingFont}', serif`, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{s.headline || "Call to Action"}</div>
          {s.subtext && <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 20 }}>{s.subtext}</div>}
          {s.cta_text && <span style={{ display: "inline-block", background: "#fff", color: "#111", padding: "12px 32px", fontSize: 13, fontWeight: 600 }}>{s.cta_text}</span>}
        </div>
      );

    case "newsletter":
      return (
        <div style={{ padding: "40px 32px", background: s.background_color || "#0F172A", color: s.text_color || "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{s.headline || "Newsletter"}</div>
          <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>{s.subtext}</div>
          <div style={{ display: "flex", gap: 8, maxWidth: 320, margin: "0 auto" }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,.1)", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: "#94A3B8" }}>{s.placeholder || "Enter email"}</div>
            <div style={{ background: s.button_color || "#10B981", padding: "10px 20px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{s.button_text || "Subscribe"}</div>
          </div>
        </div>
      );

    case "countdown_timer":
      return (
        <div style={{ padding: "40px 32px", background: s.background_color || "#0F172A", color: s.text_color || "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{s.headline || "Sale Ends In"}</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {["23", "14", "52"].map((v, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.1)", borderRadius: 8, padding: "10px 14px", minWidth: 50 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.accent_color || "#EF4444" }}>{v}</div>
                <div style={{ fontSize: 9, opacity: 0.5, textTransform: "uppercase", letterSpacing: ".1em" }}>{["HRS", "MIN", "SEC"][i]}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "urgency_bar":
      return (
        <div style={{ background: s.background_color || "#DC2626", color: s.text_color || "#fff", padding: "10px 20px", textAlign: "center", fontSize: 13, fontWeight: 500 }}>
          {s.message || "🔥 Limited stock!"}
        </div>
      );

    case "footer":
      return (
        <div style={{ background: s.background_color || "#0F172A", color: s.text_color || "#94A3B8", padding: "36px 32px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{s.logo_text || "Store"}</div>
              <div style={{ fontSize: 12, lineHeight: 1.6 }}>{s.tagline}</div>
            </div>
            {(s.columns || []).map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: 10, letterSpacing: ".12em", color: "rgba(255,255,255,.4)", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>{col.title}</div>
                {col.links.map((link, j) => <div key={j} style={{ fontSize: 12, marginBottom: 6 }}>{link}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 12, fontSize: 11, display: "flex", justifyContent: "space-between" }}>
            <span>{s.copyright}</span><span>{s.footer_note}</span>
          </div>
        </div>
      );

    default:
      return (
        <div style={{ padding: 32, textAlign: "center", color: "#9CA3AF", background: "#F9FAFB" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{getSectionMeta(s.type).icon}</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{getSectionMeta(s.type).label}</div>
        </div>
      );
  }
}

// ── Section Settings Panel (Right) ──
function SectionSettings({ section, onUpdate }) {
  const s = section;
  const meta = getSectionMeta(s.type);

  const field = (label, key, type = "text") => {
    const value = s[key] ?? "";
    if (type === "color") {
      return (
        <div style={styles.settingsRow}>
          <label style={styles.settingsLabel}>{label}</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="color" value={value || "#000000"} onChange={(e) => onUpdate({ [key]: e.target.value })} style={{ width: 32, height: 32, border: "none", cursor: "pointer" }} />
            <input type="text" value={value} onChange={(e) => onUpdate({ [key]: e.target.value })} style={styles.settingsInput} />
          </div>
        </div>
      );
    }
    if (type === "textarea") {
      return (
        <div style={styles.settingsRow}>
          <label style={styles.settingsLabel}>{label}</label>
          <textarea value={value} onChange={(e) => onUpdate({ [key]: e.target.value })} rows={3} style={styles.settingsTextarea} />
        </div>
      );
    }
    if (type === "number") {
      return (
        <div style={styles.settingsRow}>
          <label style={styles.settingsLabel}>{label}</label>
          <input type="number" value={value} onChange={(e) => onUpdate({ [key]: parseInt(e.target.value) || 0 })} style={styles.settingsInput} />
        </div>
      );
    }
    return (
      <div style={styles.settingsRow}>
        <label style={styles.settingsLabel}>{label}</label>
        <input type="text" value={value} onChange={(e) => onUpdate({ [key]: e.target.value })} style={styles.settingsInput} />
      </div>
    );
  };

  return (
    <div style={styles.settingsPanel}>
      <div style={styles.settingsHeader}>
        <span style={{ fontSize: 22 }}>{meta.icon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{meta.label}</div>
          <div style={{ fontSize: 11, color: "#6B7280" }}>{meta.desc}</div>
        </div>
      </div>

      <div style={styles.settingsBody}>
        {/* Common fields by type */}
        {["hero", "image_with_text", "product_showcase", "social_proof", "faq", "cta_banner"].includes(s.type) && field("Headline", "headline")}
        {["hero", "image_with_text", "product_showcase", "cta_banner"].includes(s.type) && field("Subtext", "subtext", "textarea")}
        {s.type === "hero" && field("Badge Text", "badge_text")}
        {s.type === "hero" && field("CTA Text", "cta_text")}
        {s.type === "hero" && field("Secondary CTA", "cta_secondary_text")}
        {s.type === "hero" && field("Image Label", "image_label")}
        {s.type === "hero" && field("Price Current", "price_current")}
        {s.type === "hero" && field("Price Original", "price_original")}
        {s.type === "hero" && field("Price Badge", "price_badge")}
        {s.type === "announcement_bar" && field("Message", "message")}
        {s.type === "urgency_bar" && field("Message", "message")}
        {s.type === "newsletter" && field("Headline", "headline")}
        {s.type === "newsletter" && field("Subtext", "subtext")}
        {s.type === "newsletter" && field("Placeholder", "placeholder")}
        {s.type === "newsletter" && field("Button Text", "button_text")}
        {s.type === "countdown_timer" && field("Headline", "headline")}
        {s.type === "countdown_timer" && field("Subtext", "subtext")}
        {s.type === "cta_banner" && field("CTA Text", "cta_text")}
        {s.type === "footer" && field("Logo Text", "logo_text")}
        {s.type === "footer" && field("Tagline", "tagline", "textarea")}
        {s.type === "footer" && field("Copyright", "copyright")}
        {s.type === "footer" && field("Footer Note", "footer_note")}

        {s.type === "image_with_text" && field("Kicker", "kicker")}
        {s.type === "image_with_text" && field("Body Text", "text", "textarea")}
        {s.type === "product_showcase" && field("Kicker", "kicker")}
        {s.type === "product_showcase" && field("Columns", "columns", "number")}
        {s.type === "social_proof" && field("Kicker", "kicker")}
        {s.type === "social_proof" && field("Overall Rating", "overall_rating")}
        {s.type === "social_proof" && field("Total Reviews", "total_reviews")}

        {/* Design fields */}
        <div style={styles.settingsDivider}>Design</div>
        {field("Background", "background_color", "color")}
        {["hero", "cta_banner", "newsletter", "countdown_timer", "urgency_bar", "announcement_bar"].includes(s.type) && field("Text Color", "text_color", "color")}
        {["hero", "cta_banner"].includes(s.type) && field("CTA Color", "cta_color", "color")}
        {field("Padding Y", "padding_y", "number")}
      </div>
    </div>
  );
}

// ── Styles ──
const styles = {
  root: { display: "flex", flexDirection: "column", height: "100vh", background: "#F1F5F9", fontFamily: "'Inter', -apple-system, sans-serif" },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 52, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", flexShrink: 0, zIndex: 10 },
  toolbarLeft: { display: "flex", alignItems: "center", gap: 12 },
  toolbarCenter: { display: "flex", gap: 4 },
  toolbarRight: { display: "flex", gap: 8 },
  backBtn: { background: "none", border: "1px solid #E2E8F0", padding: "6px 14px", fontSize: 13, borderRadius: 6, cursor: "pointer", color: "#374151" },
  divider: { width: 1, height: 24, background: "#E2E8F0" },
  titleInput: { border: "none", fontSize: 15, fontWeight: 600, color: "#111827", outline: "none", width: 200 },
  saveStatus: { fontSize: 11, color: "#6B7280", marginLeft: 8 },
  viewportBtn: { width: 36, height: 36, border: "1px solid #E2E8F0", background: "#F9FAFB", borderRadius: 6, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" },
  viewportActive: { background: "#EFF6FF", borderColor: "#3B82F6" },
  saveBtn: { background: "#F9FAFB", border: "1px solid #D1D5DB", padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 8, cursor: "pointer", color: "#374151" },
  publishBtn: { background: "#2563EB", color: "#fff", border: "none", padding: "8px 22px", fontSize: 13, fontWeight: 600, borderRadius: 8, cursor: "pointer" },
  toast: { position: "fixed", top: 64, left: "50%", transform: "translateX(-50%)", background: "#065F46", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, zIndex: 999, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 24px rgba(0,0,0,.2)" },
  toastLink: { color: "#A7F3D0", fontWeight: 600 },
  toastClose: { background: "none", border: "none", color: "#fff", fontSize: 16, cursor: "pointer", marginLeft: 8 },
  body: { display: "flex", flex: 1, overflow: "hidden" },

  // Left panel
  leftPanel: { width: 280, background: "#fff", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", overflow: "hidden" },
  panelTabs: { display: "flex", borderBottom: "1px solid #E2E8F0" },
  panelTab: { flex: 1, padding: "10px 0", fontSize: 12, fontWeight: 500, textAlign: "center", border: "none", background: "none", cursor: "pointer", color: "#6B7280", borderBottom: "2px solid transparent" },
  panelTabActive: { color: "#2563EB", borderBottomColor: "#2563EB" },
  sectionList: { flex: 1, overflow: "auto", padding: 12 },
  sectionItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 4, border: "1px solid transparent", transition: "all .15s" },
  sectionItemActive: { background: "#EFF6FF", border: "1px solid #BFDBFE" },
  sectionItemLeft: { display: "flex", alignItems: "center", gap: 10 },
  sectionIcon: { fontSize: 18, width: 32, height: 32, background: "#F1F5F9", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sectionLabel: { fontSize: 13, fontWeight: 600, color: "#111827" },
  sectionType: { fontSize: 11, color: "#6B7280", maxWidth: 120, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  sectionActions: { display: "flex", gap: 2 },
  microBtn: { width: 24, height: 24, border: "none", background: "none", cursor: "pointer", fontSize: 12, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" },
  addSectionBtn: { width: "100%", padding: "12px 0", border: "2px dashed #D1D5DB", background: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer", marginTop: 8 },

  // Style panel
  stylePanel: { flex: 1, overflow: "auto", padding: 16 },
  styleSectionTitle: { fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 },
  colorRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  colorLabel: { fontSize: 12, color: "#374151", textTransform: "capitalize", width: 80, flexShrink: 0 },
  colorInput: { width: 28, height: 28, border: "1px solid #D1D5DB", borderRadius: 4, cursor: "pointer", padding: 0 },
  colorHex: { fontSize: 11, color: "#6B7280", fontFamily: "monospace" },
  fontRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  fontSelect: { flex: 1, padding: "6px 8px", border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 12, background: "#F9FAFB" },
  seoField: { marginBottom: 16 },
  seoInput: { width: "100%", padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 13, marginTop: 4 },
  seoTextarea: { width: "100%", padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 13, marginTop: 4, resize: "vertical", fontFamily: "inherit" },

  // Canvas
  canvas: { flex: 1, overflow: "auto", display: "flex", justifyContent: "center", padding: "20px 0", background: "#E2E8F0" },
  canvasViewport: { width: "100%", background: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,.1)", borderRadius: 8, transition: "max-width .3s", overflow: "hidden" },
  canvasSection: { position: "relative", cursor: "pointer", transition: "all .15s", border: "2px solid transparent" },
  canvasSectionSelected: { border: "2px solid #3B82F6" },
  sectionOverlayLabel: { position: "absolute", top: -1, left: -1, background: "#3B82F6", color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 10px", zIndex: 5, borderRadius: "0 0 4px 0" },
  emptyCanvas: { padding: "80px 40px", textAlign: "center" },

  // Right panel
  rightPanel: { width: 300, background: "#fff", borderLeft: "1px solid #E2E8F0", display: "flex", flexDirection: "column", overflow: "hidden" },
  noSelection: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9CA3AF" },
  settingsPanel: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" },
  settingsHeader: { display: "flex", alignItems: "center", gap: 12, padding: 16, borderBottom: "1px solid #E2E8F0" },
  settingsBody: { flex: 1, overflow: "auto", padding: 16 },
  settingsRow: { marginBottom: 14 },
  settingsLabel: { fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 },
  settingsInput: { width: "100%", padding: "7px 10px", border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 13, outline: "none" },
  settingsTextarea: { width: "100%", padding: "7px 10px", border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 13, resize: "vertical", fontFamily: "inherit", outline: "none" },
  settingsDivider: { fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".08em", marginTop: 12, marginBottom: 10, paddingTop: 12, borderTop: "1px solid #E5E7EB" },

  // Add section modal
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" },
  addModal: { background: "#fff", borderRadius: 16, width: 620, maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.2)" },
  addModalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #E5E7EB" },
  closeBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6B7280" },
  addCatRow: { display: "flex", gap: 6, padding: "12px 24px", flexWrap: "wrap" },
  catBtn: { padding: "6px 14px", fontSize: 12, fontWeight: 500, border: "1px solid #E5E7EB", borderRadius: 20, background: "#F9FAFB", cursor: "pointer", color: "#6B7280" },
  catBtnActive: { background: "#2563EB", color: "#fff", borderColor: "#2563EB" },
  addGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "16px 24px 24px" },
  addCard: { border: "1px solid #E5E7EB", borderRadius: 10, padding: 16, cursor: "pointer", textAlign: "center", transition: "all .15s" },
  addCardIcon: { fontSize: 28, marginBottom: 8 },
  addCardLabel: { fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4 },
  addCardDesc: { fontSize: 11, color: "#6B7280" },
};
