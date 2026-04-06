import { useState, useCallback, useEffect, useRef } from "react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { listThemeSections, fetchAsset } from "../lib/convertflow.server.js";
import { parseShopifySchema, sectionKeyToLabel } from "../utils/schema-parser";
import { shopifyFetchWithRetry } from "../lib/shopify-fetch.server.js";
import { CONVERTKIT_TEMPLATES } from "../data/convertkit-templates";
import type { ShopifySection, ShopifySchema, ViewportMode, SelectedSectionState, ThemeSettingGroup } from "../types/convertflow";
import TopBar from "../components/convertflow/TopBar";
import LeftSidebar from "../components/convertflow/LeftSidebar";
import CenterPreview from "../components/convertflow/CenterPreview";
import RightSettingsPanel from "../components/convertflow/RightSettingsPanel";
import AddSectionModal from "../components/convertflow/AddSectionModal";

// ── Loader ──
export const loader = async ({ request }: { request: Request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  const token = session.accessToken;
  let themeId = "";
  let themeName = "";
  let passwordEnabled = false;
  let productHandle = "";
  let sections: Array<{ key: string; name: string; updated_at?: string }> = [];
  let sectionSchemas: Record<string, ShopifySchema> = {};
  let settingsData: Record<string, unknown> = {};

  try {
    const [themesRes, productsRes, shopRes] = await Promise.all([
      admin.graphql(`query { themes(first: 10) { edges { node { id name role } } } }`),
      admin.graphql(`query { products(first: 1, query: "status:active") { edges { node { handle } } } }`),
      shopifyFetchWithRetry(`https://${shopDomain}/admin/api/2025-01/shop.json`, {
        headers: { "X-Shopify-Access-Token": token },
      }),
    ]);

    const themesData = await themesRes.json();
    const themesList = (themesData as any).data.themes.edges.map((e: any) => e.node);
    const mainTheme = themesList.find((t: any) => t.role === "MAIN");
    
    if (mainTheme) {
      themeId = mainTheme.id.replace("gid://shopify/OnlineStoreTheme/", "");
      themeName = mainTheme.name;
    }

    const productsData = await productsRes.json();
    productHandle = (productsData as any).data.products.edges[0]?.node?.handle || "";

    if (shopRes?.ok) {
      const shopData = await shopRes.json();
      passwordEnabled = (shopData as any).shop?.password_enabled || false;
    }
  } catch (e: any) {
    console.error("ConvertFlow loader error:", e.message);
  }

  let settingsSchemaGroups: ThemeSettingGroup[] = [];

  if (themeId) {
    try {
      sections = await listThemeSections(admin, session, themeId);
      try {
        const raw = await fetchAsset(admin, session, themeId, "config/settings_data.json");
        settingsData = JSON.parse(raw);
      } catch (_e) { /* no settings data */ }

      // Load global theme settings schema
      try {
        const schemaRaw = await fetchAsset(admin, session, themeId, "config/settings_schema.json");
        const parsed = JSON.parse(schemaRaw);
        if (Array.isArray(parsed)) {
          settingsSchemaGroups = parsed
            .filter((g: any) => g.name && Array.isArray(g.settings))
            .map((g: any) => ({ name: g.name, settings: g.settings }));
        }
      } catch (_e) { /* no settings schema */ }

      const sectionFiles = sections.slice(0, 30);
      const results = await Promise.all(
        sectionFiles.map(async (s) => {
          try {
            const content = await fetchAsset(admin, session, themeId, s.key);
            return { key: s.key, schema: parseShopifySchema(content) };
          } catch (_e) {
            return { key: s.key, schema: { name: sectionKeyToLabel(s.key), settings: [], blocks: [] } as ShopifySchema };
          }
        })
      );
      results.forEach((r) => { sectionSchemas[r.key] = r.schema; });
    } catch (e: any) {
      console.error("Section fetch error:", e.message);
    }
  }

  return json({
    shopDomain, themeId, themeName, passwordEnabled, productHandle,
    sections, sectionSchemas, settingsData, settingsSchemaGroups,
    templates: CONVERTKIT_TEMPLATES.map((t) => ({ id: t.id, name: t.name, category: t.category, niche: t.niche, liquidCode: "", cssCode: "", schemaCode: "" })),
  });
};

// ── Categorize ──
function categorizeSections(
  sections: Array<{ key: string; name: string }>,
  schemas: Record<string, ShopifySchema>,
): { header: ShopifySection[]; template: ShopifySection[]; footer: ShopifySection[] } {
  const header: ShopifySection[] = [];
  const footer: ShopifySection[] = [];
  const template: ShopifySection[] = [];
  for (const s of sections) {
    const schema = schemas[s.key];
    const n = (schema?.name || s.name).toLowerCase();
    const sec: ShopifySection = { ...s, schema, group: "template" };
    if (n.includes("header") || n.includes("announcement")) { sec.group = "header"; header.push(sec); }
    else if (n.includes("footer")) { sec.group = "footer"; footer.push(sec); }
    else { template.push(sec); }
  }
  return { header, template, footer };
}

// ── Component ──
export default function ConvertFlowEditor() {
  const { shopDomain, themeId, themeName, passwordEnabled, sections, sectionSchemas, settingsData, templates, settingsSchemaGroups } = useLoaderData<typeof loader>();
  const [selectedSectionKey, setSelectedSectionKey] = useState<string | null>(null);
  const [pageInstances, setPageInstances] = useState<Array<{ id: string; type: string }>>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState("/");
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settingValues, setSettingValues] = useState<Record<string, unknown>>({});
  const [themeSettingValues, setThemeSettingValues] = useState<Record<string, unknown>>({});
  const [sidebarTab, setSidebarTab] = useState<"sections" | "settings">("sections");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addModalPos, setAddModalPos] = useState({ top: 200, left: 100 });
  const [addModalInsertIndex, setAddModalInsertIndex] = useState<number | undefined>();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const proxyIframeRef = useRef<HTMLIFrameElement | null>(null);
  const settingsDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Undo/Redo State
  const [history, setHistory] = useState<{
    past: Array<{ settings: any, themeSettings: any, instances: any }>;
    future: Array<{ settings: any, themeSettings: any, instances: any }>;
  }>({ past: [], future: [] });

  const { header, template, footer } = categorizeSections(sections, sectionSchemas);

  useEffect(() => {
    const sd = settingsData as any;
    if (sd?.current?.sections) setSettingValues(sd.current.sections);
    // Extract global theme settings (non-section keys from current)
    if (sd?.current) {
      const { sections: _s, ...globalSettings } = sd.current;
      setThemeSettingValues(globalSettings);
    }
  }, []);

  const sendToIframe = useCallback((msg: unknown) => {
    proxyIframeRef.current?.contentWindow?.postMessage(msg, "*");
  }, []);

  const pushHistory = useCallback((nextSettings: any, nextThemeSettings: any, nextInstances: any) => {
    setHistory(prev => {
      const newPast = [...prev.past, { settings: settingValues, themeSettings: themeSettingValues, instances: pageInstances }];
      if (newPast.length > 50) newPast.shift(); // Limit to 50 steps
      return { past: newPast, future: [] };
    });
  }, [settingValues, themeSettingValues, pageInstances]);

  const handleUndo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      setSettingValues(previous.settings);
      setThemeSettingValues(previous.themeSettings);
      setPageInstances(previous.instances);
      setHasChanges(true);
      sendToIframe({ type: "CK_RELOAD_PAGE" });
      return {
        past: newPast,
        future: [{ settings: settingValues, themeSettings: themeSettingValues, instances: pageInstances }, ...prev.future]
      };
    });
  }, [settingValues, themeSettingValues, pageInstances, sendToIframe]);

  const handleRedo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      setSettingValues(next.settings);
      setThemeSettingValues(next.themeSettings);
      setPageInstances(next.instances);
      setHasChanges(true);
      sendToIframe({ type: "CK_RELOAD_PAGE" });
      return {
        past: [...prev.past, { settings: settingValues, themeSettings: themeSettingValues, instances: pageInstances }],
        future: newFuture
      };
    });
  }, [settingValues, themeSettingValues, pageInstances, sendToIframe]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?.type?.startsWith?.("CK_")) return;
      if (e.data.type === "CK_INSPECTOR_READY") {
        sendToIframe({ type: "CK_GET_SECTIONS" });
        sendToIframe({ type: "CK_TOGGLE_INSPECTOR", enabled: true });
      } else if (e.data.type === "CK_SECTIONS_LIST") {
        // Deduplicate by sectionId
        const seen = new Set<string>();
        const deduped = (e.data.sections as any[]).filter((s: any) => {
          if (seen.has(s.sectionId)) return false;
          seen.add(s.sectionId);
          return true;
        });
        setPageInstances(deduped.map((s: any) => {
          let type = s.sectionType;
          // Strategy 1: Use sectionType if provided
          if (!type && s.sectionId.includes("__")) type = s.sectionId.split("__").pop();
          // Strategy 2: Match against known section schema keys (longest match)
          if (!type) {
            const idLower = s.sectionId.toLowerCase().replace(/-/g, "_");
            let best = "";
            for (const k of Object.keys(sectionSchemas)) {
              const base = k.replace("sections/","").replace(".liquid","").replace(/-/g,"_").toLowerCase();
              if (idLower.startsWith(base) && base.length > best.length) best = k;
              // Also try: sectionId contains the base name anywhere
              if (!best && idLower.includes(base) && base.length > 3) best = k;
            }
            if (best) type = best.replace("sections/","").replace(".liquid","");
          }
          // Strategy 3: Try exact key match with dashes
          if (!type) {
            const dashKey = `sections/${s.sectionId.replace(/_/g, "-")}.liquid`;
            if (sectionSchemas[dashKey]) type = s.sectionId.replace(/_/g, "-");
          }
          return { id: s.sectionId, type: type || s.sectionId };
        }));
      } else if (e.data.type === "CK_SECTION_CLICKED") {
        setSelectedSectionKey(e.data.sectionId);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [sendToIframe, sectionSchemas]);

  const handlePageChange = useCallback((page: string) => {
    setCurrentPage(page);
    setIframeKey((k) => k + 1);
    setIframeLoading(true);
  }, []);

  const handleSettingChange = useCallback((settingId: string, value: unknown) => {
    setHasChanges(true);
    const instanceId = selectedSectionKey || "";
    
    setSettingValues((prev) => {
      const next = {
        ...prev,
        [instanceId]: { ...((prev[instanceId] as Record<string, unknown>) || {}), [settingId]: value },
      };
      pushHistory(next, themeSettingValues, pageInstances);
      
      let tKey = "templates/index.json";
      if (currentPage.includes("/products/")) tKey = "templates/product.json";
      else if (currentPage.includes("/collections/")) tKey = "templates/collection.json";
      else if (currentPage.includes("/pages/")) tKey = "templates/page.json";
      else if (currentPage.includes("/cart")) tKey = "templates/cart.json";

      if (settingsDebounceRef.current) clearTimeout(settingsDebounceRef.current);
      settingsDebounceRef.current = setTimeout(async () => {
        sendToIframe({ type: "CK_INJECT_CSS", settingId, value });
        try {
          await fetch("/api/convertflow/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ themeId, settings: { [instanceId]: next[instanceId] }, templateKey: tKey }),
          });
          sendToIframe({ type: "CK_RELOAD_SECTION", sectionId: instanceId });
        } catch (e) { console.error("Auto-save failed", e); }
      }, 500);
      
      return next;
    });
  }, [selectedSectionKey, sendToIframe, themeId, currentPage, pushHistory, themeSettingValues, pageInstances]);

  // Build live section lists FIRST (so selectedSection resolver can reuse their schemas)
  const liveHeader: ShopifySection[] = [];
  const liveTemplate: ShopifySection[] = [];
  const liveFooter: ShopifySection[] = [];

  const resolveSchema = (type: string) => {
    let schema = sectionSchemas[`sections/${type}.liquid`] || null;
    if (!schema) schema = sectionSchemas[`sections/${type.replace(/_/g, "-")}.liquid`] || null;
    if (!schema) schema = sectionSchemas[`sections/${type.replace(/-/g, "_")}.liquid`] || null;
    if (!schema) {
      const baseType = type.replace(/_[a-f0-9]{6,}$/i, "").replace(/-[a-f0-9]{6,}$/i, "");
      schema = sectionSchemas[`sections/${baseType}.liquid`]
        || sectionSchemas[`sections/${baseType.replace(/_/g, "-")}.liquid`]
        || null;
    }
    if (!schema) {
      const typeLower = type.toLowerCase().replace(/-/g, "_");
      for (const [k, v] of Object.entries(sectionSchemas)) {
        const base = k.replace("sections/","").replace(".liquid","").replace(/-/g,"_").toLowerCase();
        if (typeLower.startsWith(base) || typeLower.includes(base) || base.includes(typeLower)) {
          schema = v; break;
        }
      }
    }
    if (!schema) {
      const staticMatch = sections.find(s => {
        const sBase = s.key.replace("sections/","").replace(".liquid","").replace(/-/g,"_").toLowerCase();
        const tBase = type.replace(/-/g,"_").toLowerCase();
        return sBase === tBase || tBase.startsWith(sBase) || sBase.startsWith(tBase);
      });
      if (staticMatch) schema = sectionSchemas[staticMatch.key] || null;
    }
    return schema;
  };

  pageInstances.forEach((instance) => {
    const type = instance.type;
    const schema = resolveSchema(type);
    const n = (schema?.name || type).toLowerCase();
    
    let group = "template";
    if (n.includes("header") || n.includes("announcement")) group = "header";
    else if (n.includes("footer")) group = "footer";

    const sec: ShopifySection = {
      key: instance.id,
      name: schema?.name || type,
      disabled: (settingValues[instance.id] as any)?.disabled === true,
      schema,
      group: group as any,
    };

    if (group === "header") liveHeader.push(sec);
    else if (group === "footer") liveFooter.push(sec);
    else liveTemplate.push(sec);
  });

  // Now resolve selectedSection — first try the already-resolved live sections
  const selectedSection: SelectedSectionState | null = selectedSectionKey
    ? (() => {
        const allLive = [...liveHeader, ...liveTemplate, ...liveFooter];
        const liveMatch = allLive.find(s => s.key === selectedSectionKey);
        if (liveMatch?.schema) {
          return { key: selectedSectionKey, name: liveMatch.schema.name || liveMatch.name || "", schema: liveMatch.schema };
        }
        const instance = pageInstances.find(p => p.id === selectedSectionKey);
        const type = instance?.type || selectedSectionKey;
        const schema = resolveSchema(type);
        return { key: selectedSectionKey, name: schema?.name || type || "", schema };
      })()
    : null;

  const handleAddSection = useCallback((pos: number, _group: string) => {
    setAddModalInsertIndex(pos);
    setAddModalPos({ top: 200, left: 100 });
    setAddModalVisible(true);
  }, []);

  const handleToggleVisibility = useCallback((sectionKey: string) => {
    setHasChanges(true);
    setSettingValues((prev) => {
      const current = (prev[sectionKey] as Record<string, unknown>) || {};
      const nextDisabled = !(current.disabled === true);
      const next = { ...prev, [sectionKey]: { ...current, disabled: nextDisabled } };
      pushHistory(next, themeSettingValues, pageInstances);

      // Instant DOM visibility toggle
      sendToIframe({ type: "CK_HIDE_SECTION", sectionId: sectionKey, hidden: nextDisabled });

      let tKey = "templates/index.json";
      if (currentPage.includes("/products/")) tKey = "templates/product.json";
      else if (currentPage.includes("/collections/")) tKey = "templates/collection.json";
      else if (currentPage.includes("/pages/")) tKey = "templates/page.json";
      else if (currentPage.includes("/cart")) tKey = "templates/cart.json";

      if (settingsDebounceRef.current) clearTimeout(settingsDebounceRef.current);
      settingsDebounceRef.current = setTimeout(async () => {
        try {
          await fetch("/api/convertflow/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ themeId, settings: { [sectionKey]: next[sectionKey] }, templateKey: tKey }),
          });
        } catch (e) { console.error("Visibility toggle failed", e); }
      }, 500);

      return next;
    });
  }, [themeId, currentPage, sendToIframe, pushHistory, themeSettingValues, pageInstances]);

  const handleRemoveSection = useCallback(async (sectionKey: string) => {
    if (!confirm(`Remove this section? This action cannot be undone.`)) return;

    let tKey = "templates/index.json";
    if (currentPage.includes("/products/")) tKey = "templates/product.json";
    else if (currentPage.includes("/collections/")) tKey = "templates/collection.json";
    else if (currentPage.includes("/pages/")) tKey = "templates/page.json";
    else if (currentPage.includes("/cart")) tKey = "templates/cart.json";

    try {
      await fetch("/api/convertflow/settings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId, sectionId: sectionKey, templateKey: tKey }),
      });
      setSelectedSectionKey(null);
      setSettingValues((prev) => {
        const next = { ...prev };
        delete next[sectionKey];
        return next;
      });
      setIframeKey((k) => k + 1);
    } catch (e) {
      console.error("Remove section failed:", e);
    }
  }, [themeId, currentPage]);

  const handleReorderSections = useCallback(async (fromIdx: number, toIdx: number) => {
    const reordered = [...liveTemplate];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    const templateInstances = pageInstances.filter((inst) => {
      const type = inst.type;
      const schemaKey = `sections/${type}.liquid`;
      const schema = sectionSchemas[schemaKey];
      const n = (schema?.name || type).toLowerCase();
      return !n.includes("header") && !n.includes("announcement") && !n.includes("footer");
    });
    const nonTemplate = pageInstances.filter((inst) => {
      const type = inst.type;
      const schemaKey = `sections/${type}.liquid`;
      const schema = sectionSchemas[schemaKey];
      const n = (schema?.name || type).toLowerCase();
      return n.includes("header") || n.includes("announcement") || n.includes("footer");
    });

    const reorderedInstances = [...templateInstances];
    const [movedInst] = reorderedInstances.splice(fromIdx, 1);
    reorderedInstances.splice(toIdx, 0, movedInst);
    
    const newInstances = [...nonTemplate, ...reorderedInstances];
    pushHistory(settingValues, themeSettingValues, newInstances);
    setPageInstances(newInstances);
    setHasChanges(true);

    // Instant DOM section move
    sendToIframe({ type: "CK_MOVE_SECTION", fromId: movedInst.id, toId: reorderedInstances[toIdx === 0 ? 1 : toIdx - 1]?.id, appendAfter: toIdx !== 0 });

    let tKey = "templates/index.json";
    if (currentPage.includes("/products/")) tKey = "templates/product.json";
    else if (currentPage.includes("/collections/")) tKey = "templates/collection.json";
    else if (currentPage.includes("/pages/")) tKey = "templates/page.json";
    else if (currentPage.includes("/cart")) tKey = "templates/cart.json";

    const newOrder = reordered.map((s) => s.key);
    try {
      await fetch("/api/convertflow/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId, templateKey: tKey, order: newOrder }),
      });
    } catch (e) { console.error("Reorder failed:", e); }
  }, [liveTemplate, pageInstances, sectionSchemas, themeId, currentPage, pushHistory, settingValues, themeSettingValues, sendToIframe]);

  const handleThemeSettingChange = useCallback((_groupIdx: number, settingId: string, value: unknown) => {
    setHasChanges(true);
    setThemeSettingValues((prev) => {
      const next = { ...prev, [settingId]: value };
      pushHistory(settingValues, next, pageInstances);

      if (settingsDebounceRef.current) clearTimeout(settingsDebounceRef.current);
      settingsDebounceRef.current = setTimeout(async () => {
        try {
          await fetch("/api/convertflow/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ themeId, globalSettings: { [settingId]: value } }),
          });
          sendToIframe({ type: "CK_RELOAD_PAGE" });
        } catch (e) { console.error("Theme setting save failed:", e); }
      }, 800);
      return next;
    });
  }, [themeId, sendToIframe, pushHistory, settingValues, pageInstances]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await fetch("/api/convertflow/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId, settings: settingValues, globalSettings: themeSettingValues }),
      });
      setHasChanges(false);
    } catch (e) { console.error("Save error:", e); }
    finally { setSaving(false); }
  }, [themeId, settingValues, themeSettingValues]);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", position: "fixed", inset: 0, zIndex: 999, background: "#e8e8e8" }}>
      <TopBar
        shopDomain={shopDomain} themeName={themeName}
        currentPage={currentPage} onPageChange={handlePageChange}
        hasChanges={hasChanges} saving={saving} onSave={handleSave}
        canUndo={history.past.length > 0} canRedo={history.future.length > 0}
        onUndo={handleUndo} onRedo={handleRedo}
        isPreviewMode={isPreviewMode} onTogglePreview={() => {
          setIsPreviewMode(!isPreviewMode);
          sendToIframe({ type: "CK_TOGGLE_INSPECTOR", enabled: isPreviewMode }); // If entering preview mode, disable inspector hover borders
        }}
      />
      <div style={{ display: "flex", flex: 1, overflow: "hidden", background: "#1A1A1F" }}>
        {!isPreviewMode && (
          <LeftSidebar
            headerSections={liveHeader} templateSections={liveTemplate} footerSections={liveFooter}
            selectedSectionKey={selectedSectionKey} expandedSections={expandedSections}
            onSelectSection={(key) => {
              setSelectedSectionKey(key);
              sendToIframe({ type: "CK_SELECT_SECTION", sectionId: key });
            }}
            onToggleExpand={(key) => setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))}
            onAddSection={handleAddSection}
            onReorderSections={handleReorderSections}
            onToggleVisibility={handleToggleVisibility}
            activeTab={sidebarTab} onTabChange={setSidebarTab}
            themeSettings={themeSettingValues}
            onThemeSettingChange={handleThemeSettingChange}
            settingsSchema={settingsSchemaGroups}
          />
        )}
        <CenterPreview
          shopDomain={shopDomain} themeId={themeId} currentPath={currentPage} viewport={viewport}
          onViewportChange={setViewport}
          passwordEnabled={passwordEnabled} iframeRef={proxyIframeRef}
          iframeKey={iframeKey} iframeLoading={iframeLoading}
          onIframeLoad={() => setIframeLoading(false)}
          onRefresh={() => { setIframeKey((k) => k + 1); setIframeLoading(true); }}
          zoom={zoom} onZoomChange={setZoom}
        />
        {!isPreviewMode && (
          <RightSettingsPanel
            selectedSection={selectedSection} values={settingValues}
            onChange={handleSettingChange} onBack={() => setSelectedSectionKey(null)}
            onRemoveSection={handleRemoveSection}
          />
        )}
      </div>
      <AddSectionModal
        visible={addModalVisible} position={addModalPos}
        sections={[...header, ...template, ...footer]}
        templates={templates as any}
        insertIndex={addModalInsertIndex}
        onClose={() => setAddModalVisible(false)}
        onSelectTemplate={async (id, idx) => { 
          setAddModalVisible(false);
          setSaving(true);
          let tKey = "templates/index.json";
          if (currentPage.includes("/products/")) tKey = "templates/product.json";
          else if (currentPage.includes("/collections/")) tKey = "templates/collection.json";
          else if (currentPage.includes("/pages/")) tKey = "templates/page.json";
          else if (currentPage.includes("/cart")) tKey = "templates/cart.json";

          try {
            const res = await fetch("/api/convertflow/install-template", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ themeId, templateId: id, templateKey: tKey, insertIndex: idx })
            });
            if (res.ok) {
              setIframeKey((k) => k + 1);
            }
          } catch (e) {
            console.error("Install template failed:", e);
          } finally {
            setSaving(false);
          }
        }}
        onSelectSection={async (key, idx) => { 
          setAddModalVisible(false);
          const baseType = key.replace("sections/", "").replace(".liquid", "");
          const newInstanceId = `${baseType}_${Math.random().toString(36).slice(-6)}`;
          
          let tKey = "templates/index.json";
          if (currentPage.includes("/products/")) tKey = "templates/product.json";
          else if (currentPage.includes("/collections/")) tKey = "templates/collection.json";
          else if (currentPage.includes("/pages/")) tKey = "templates/page.json";
          else if (currentPage.includes("/cart")) tKey = "templates/cart.json";

          try {
            await fetch("/api/convertflow/settings", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                insertIndex: idx,
                themeId,
                templateKey: tKey,
                settings: {
                  [newInstanceId]: { type: baseType, settings: {} }
                }
              }),
            });
            // Force fully reload iframe to show newly appended section
            setIframeKey((k) => k + 1);
            setSelectedSectionKey(newInstanceId);
          } catch (e) {
             console.error("Failed to add section", e);
          }
        }}
      />
    </div>
  );
}
