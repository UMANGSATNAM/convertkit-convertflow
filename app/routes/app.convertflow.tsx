import { useState, useCallback, useEffect, useRef } from "react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { listThemeSections, fetchAsset } from "../lib/convertflow.server.js";
import { parseShopifySchema, sectionKeyToLabel } from "../utils/schema-parser";
import { shopifyFetchWithRetry } from "../lib/shopify-fetch.server.js";
import { CONVERTKIT_TEMPLATES } from "../data/convertkit-templates";
import type { ShopifySection, ShopifySchema, ViewportMode, SelectedSectionState } from "../types/convertflow";
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
    const draftTheme = themesList.find((t: any) => t.name.includes("ConvertFlow Draft"));
    
    if (!draftTheme && mainTheme) {
      const mainThemeId = mainTheme.id.replace("gid://shopify/OnlineStoreTheme/", "");
      const createRes = await shopifyFetchWithRetry(`https://${shopDomain}/admin/api/2025-01/themes.json`, {
        method: "POST",
        headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: { name: "ConvertFlow Draft", role: "unpublished" },
          source_theme_id: parseInt(mainThemeId)
        })
      });
      if (createRes?.ok) {
        const createData = await createRes.json();
        themeId = createData.theme.id.toString();
        themeName = createData.theme.name;
      } else {
        themeId = mainThemeId;
        themeName = mainTheme.name;
      }
    } else if (draftTheme) {
      themeId = draftTheme.id.replace("gid://shopify/OnlineStoreTheme/", "");
      themeName = draftTheme.name;
    } else if (mainTheme) {
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

  if (themeId) {
    try {
      sections = await listThemeSections(admin, session, themeId);
      try {
        const raw = await fetchAsset(admin, session, themeId, "config/settings_data.json");
        settingsData = JSON.parse(raw);
      } catch (_e) { /* no settings data */ }

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
    sections, sectionSchemas, settingsData,
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
  const { shopDomain, themeId, passwordEnabled, sections, sectionSchemas, settingsData, templates } = useLoaderData<typeof loader>();
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
  const proxyIframeRef = useRef<HTMLIFrameElement | null>(null);
  const settingsDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?.type?.startsWith?.("CK_")) return;
      if (e.data.type === "CK_INSPECTOR_READY") {
        sendToIframe({ type: "CK_GET_SECTIONS" });
        sendToIframe({ type: "CK_TOGGLE_INSPECTOR", enabled: true });
      } else if (e.data.type === "CK_SECTIONS_LIST") {
        setPageInstances(e.data.sections.map((s: any) => {
          let type = s.sectionType;
          if (!type && s.sectionId.includes("__")) type = s.sectionId.split("__").pop();
          if (!type) {
            const idLower = s.sectionId.toLowerCase();
            let best = "";
            for (const k of Object.keys(sectionSchemas)) {
              const base = k.replace("sections/","").replace(".liquid","").replace(/-/g,"_").toLowerCase();
              if (idLower.startsWith(base) && base.length > best.length) best = k;
            }
            if (best) type = best.replace("sections/","").replace(".liquid","");
          }
          return { id: s.sectionId, type: type || s.sectionId };
        }));
      } else if (e.data.type === "CK_SECTION_CLICKED") {
        setSelectedSectionKey(e.data.sectionId);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [sendToIframe]);

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
      
      let tKey = "templates/index.json";
      if (currentPage.includes("/products/")) tKey = "templates/product.json";
      else if (currentPage.includes("/collections/")) tKey = "templates/collection.json";
      else if (currentPage.includes("/pages/")) tKey = "templates/page.json";
      else if (currentPage.includes("/cart")) tKey = "templates/cart.json";

      if (settingsDebounceRef.current) clearTimeout(settingsDebounceRef.current);
      settingsDebounceRef.current = setTimeout(async () => {
        // Instant CSS injection
        sendToIframe({ type: "CK_INJECT_CSS", settingId, value });
        
        // Auto-save to draft theme for Section Rendering API to pick it up
        try {
          await fetch("/api/convertflow/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              themeId, 
              settings: { [instanceId]: next[instanceId] },
              templateKey: tKey 
            }),
          });
          // Dispatch Hot-Swap reload mapped to the inspector script
          sendToIframe({ type: "CK_RELOAD_SECTION", sectionId: instanceId });
        } catch (e) {
          console.error("Auto-save failed", e);
        }
      }, 500);
      
      return next;
    });
  }, [selectedSectionKey, sendToIframe, themeId, currentPage]);

  const selectedSection: SelectedSectionState | null = selectedSectionKey
    ? (() => {
        const instance = pageInstances.find(p => p.id === selectedSectionKey);
        const type = instance?.type || selectedSectionKey;
        const schema = sectionSchemas[`sections/${type}.liquid`] || null;
        return { key: selectedSectionKey, name: schema?.name || type || "", schema };
      })()
    : null;

  const liveHeader: ShopifySection[] = [];
  const liveTemplate: ShopifySection[] = [];
  const liveFooter: ShopifySection[] = [];

  pageInstances.forEach((instance) => {
    const type = instance.type;
    const schemaKey = `sections/${type}.liquid`;
    const schema = sectionSchemas[schemaKey];
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
            body: JSON.stringify({ 
              themeId, 
              settings: { [sectionKey]: next[sectionKey] },
              templateKey: tKey 
            }),
          });
          sendToIframe({ type: "CK_RELOAD_SECTION", sectionId: sectionKey });
        } catch (e) { console.error("Visibility toggle failed", e); }
      }, 500);

      return next;
    });
  }, [themeId, currentPage, sendToIframe]);

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

    // Optimistic update: swap pageInstances to match
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
    setPageInstances([...nonTemplate, ...reorderedInstances]);

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
      setIframeKey((k) => k + 1);
    } catch (e) {
      console.error("Reorder failed:", e);
    }
  }, [liveTemplate, pageInstances, sectionSchemas, themeId, currentPage]);

  const handleThemeSettingChange = useCallback((_groupIdx: number, settingId: string, value: unknown) => {
    setHasChanges(true);
    setThemeSettingValues((prev) => ({ ...prev, [settingId]: value }));

    if (settingsDebounceRef.current) clearTimeout(settingsDebounceRef.current);
    settingsDebounceRef.current = setTimeout(async () => {
      try {
        await fetch("/api/convertflow/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ themeId, globalSettings: { [settingId]: value } }),
        });
        sendToIframe({ type: "CK_RELOAD_PAGE" });
      } catch (e) {
        console.error("Theme setting save failed:", e);
      }
    }, 800);
  }, [themeId, sendToIframe]);

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
        currentPage={currentPage} onPageChange={handlePageChange}
        hasChanges={hasChanges} saving={saving} onSave={handleSave}
      />
      <div style={{ display: "flex", flex: 1, overflow: "hidden", background: "#1A1A1F" }}>
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
        />
        <CenterPreview
          shopDomain={shopDomain} themeId={themeId} currentPath={currentPage} viewport={viewport}
          onViewportChange={setViewport}
          passwordEnabled={passwordEnabled} iframeRef={proxyIframeRef}
          iframeKey={iframeKey} iframeLoading={iframeLoading}
          onIframeLoad={() => setIframeLoading(false)}
        />
        <RightSettingsPanel
          selectedSection={selectedSection} values={settingValues}
          onChange={handleSettingChange} onBack={() => setSelectedSectionKey(null)}
          onRemoveSection={handleRemoveSection}
        />
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
