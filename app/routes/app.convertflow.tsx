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
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState("/");
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settingValues, setSettingValues] = useState<Record<string, unknown>>({});
  const [sidebarTab, setSidebarTab] = useState<"sections" | "settings">("sections");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addModalPos, setAddModalPos] = useState({ top: 200, left: 100 });
  const proxyIframeRef = useRef<HTMLIFrameElement | null>(null);
  const settingsDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { header, template, footer } = categorizeSections(sections, sectionSchemas);

  useEffect(() => {
    const sd = settingsData as any;
    if (sd?.current?.sections) setSettingValues(sd.current.sections);
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
      } else if (e.data.type === "CK_SECTION_CLICKED") {
        let sid = e.data.sectionType;
        if (!sid) {
          sid = e.data.sectionId || "";
          if (sid.includes("__")) sid = sid.split("__").pop();
        }
        if (sid) {
          setSelectedSectionKey(`sections/${sid}.liquid`);
          setSelectedInstanceId(e.data.sectionId);
        }
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
    const sectionName = selectedSectionKey?.replace("sections/", "").replace(".liquid", "") || "";
    
    setSettingValues((prev) => {
      const next = {
        ...prev,
        [sectionName]: { ...((prev[sectionName] as Record<string, unknown>) || {}), [settingId]: value },
      };
      
      if (settingsDebounceRef.current) clearTimeout(settingsDebounceRef.current);
      settingsDebounceRef.current = setTimeout(async () => {
        // Instant CSS injection
        sendToIframe({ type: "CK_INJECT_CSS", settingId, value });
        
        // Auto-save to draft theme for Section Rendering API to pick it up
        try {
          await fetch("/api/convertflow/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ themeId, settings: next }),
          });
          // Dispatch Hot-Swap reload mapped to the inspector script
          sendToIframe({ type: "CK_RELOAD_SECTION", sectionId: selectedInstanceId || sectionName });
        } catch (e) {
          console.error("Auto-save failed", e);
        }
      }, 500);
      
      return next;
    });
  }, [selectedSectionKey, selectedInstanceId, sendToIframe, themeId]);

  const selectedSection: SelectedSectionState | null = selectedSectionKey
    ? { key: selectedSectionKey, name: selectedSectionKey.replace("sections/", "").replace(".liquid", ""), schema: sectionSchemas[selectedSectionKey] || null }
    : null;

  const handleAddSection = useCallback((_pos: number, _group: string) => {
    setAddModalPos({ top: 200, left: 100 });
    setAddModalVisible(true);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await fetch("/api/convertflow/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId, settings: settingValues }),
      });
      setHasChanges(false);
    } catch (e) { console.error("Save error:", e); }
    finally { setSaving(false); }
  }, [themeId, settingValues]);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", position: "fixed", inset: 0, zIndex: 999, background: "#e8e8e8" }}>
      <TopBar
        currentPage={currentPage} onPageChange={handlePageChange}
        hasChanges={hasChanges} saving={saving} onSave={handleSave}
      />
      <div style={{ display: "flex", flex: 1, overflow: "hidden", background: "#1A1A1F" }}>
        <LeftSidebar
          headerSections={header} templateSections={template} footerSections={footer}
          selectedSectionKey={selectedSectionKey} expandedSections={expandedSections}
          onSelectSection={(key) => {
            setSelectedSectionKey(key);
            setSelectedInstanceId(null);
          }}
          onToggleExpand={(key) => setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))}
          onAddSection={handleAddSection}
          activeTab={sidebarTab} onTabChange={setSidebarTab}
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
        />
      </div>
      <AddSectionModal
        visible={addModalVisible} position={addModalPos}
        sections={[...header, ...template, ...footer]}
        templates={templates as any}
        onClose={() => setAddModalVisible(false)}
        onSelectTemplate={(id) => { console.log("Selected template:", id); }}
        onSelectSection={(key) => { 
          setSelectedSectionKey(key); 
          setSelectedInstanceId(null);
        }}
      />
    </div>
  );
}
