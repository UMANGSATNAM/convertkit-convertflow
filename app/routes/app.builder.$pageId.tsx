// app/routes/app.builder.$pageId.tsx
import React, { useState, useEffect, useCallback } from "react";
import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useNavigate } from "@remix-run/react";
import { Banner, Modal } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma, { getOrSyncShop } from "../db.server";
import type { PageSchema, Block, Section, DeviceViewport } from "../builder/types";
import { DEFAULT_TEMPLATES, ELEMENT_PALETTE, generateId } from "../builder/default-templates";
import { TopBar } from "../builder/components/TopBar";
import { LeftPanel } from "../builder/components/LeftPanel";
import { RightPanel } from "../builder/components/RightPanel";
import { Canvas } from "../builder/components/Canvas";
import { publishPageToShopify } from "../services/builder-publish.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getOrSyncShop(session.shop, session.accessToken);
  const pageId = params.pageId || "new";

  let pageRecord = null;
  if (pageId !== "new") {
    pageRecord = await prisma.page.findUnique({
      where: { id: pageId },
    });
  }

  // If new or not found, initialize with default template
  let initialSchema: PageSchema;
  if (pageRecord && pageRecord.sections) {
    initialSchema = {
      version: "2.0",
      id: pageRecord.id,
      title: pageRecord.title,
      handle: pageRecord.handle,
      pageType: (pageRecord.pageType as any) || "LANDING",
      layoutMode: (pageRecord.layoutMode as any) || "FULL_PAGE_NO_CHROME",
      seoTitle: pageRecord.seoTitle || "",
      seoDesc: pageRecord.seoDesc || "",
      globalStyles: (pageRecord.styles as any)?.globalStyles || DEFAULT_TEMPLATES[1].generate().globalStyles,
      sections: (pageRecord.sections as any) || DEFAULT_TEMPLATES[1].generate().sections,
    };
  } else {
    const defaultTemplate = DEFAULT_TEMPLATES[1].generate();
    initialSchema = {
      ...defaultTemplate,
      id: pageId === "new" ? generateId("p") : pageId,
    };
  }

  return json({
    pageId,
    initialSchema,
    status: pageRecord?.status || "DRAFT",
    shopDomain: session.shop,
    savedShopifyPageId: pageRecord?.shopifyPageId || null,
  });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = await getOrSyncShop(session.shop, session.accessToken);
  if (!shop) return json({ ok: false, error: "Shop not authorized." });

  const body = await request.json();
  const { intent, schema } = body;

  try {
    if (intent === "save" || intent === "publish") {
      const pageSchema = schema as PageSchema;
      const safeHandle = (pageSchema.handle || "custom-page").toLowerCase().replace(/[^a-z0-9-_]/g, "-");

      // Upsert into Prisma
      const savedPage = await prisma.page.upsert({
        where: {
          shopId_handle: {
            shopId: shop.id,
            handle: safeHandle,
          },
        },
        update: {
          title: pageSchema.title,
          pageType: pageSchema.pageType as any,
          layoutMode: pageSchema.layoutMode,
          sections: pageSchema.sections as any,
          styles: { globalStyles: pageSchema.globalStyles } as any,
          seoTitle: pageSchema.seoTitle,
          seoDesc: pageSchema.seoDesc,
          status: intent === "publish" ? "PUBLISHED" : undefined,
          publishedAt: intent === "publish" ? new Date() : undefined,
        },
        create: {
          id: pageSchema.id,
          shopId: shop.id,
          title: pageSchema.title,
          handle: safeHandle,
          pageType: pageSchema.pageType as any,
          layoutMode: pageSchema.layoutMode,
          sections: pageSchema.sections as any,
          styles: { globalStyles: pageSchema.globalStyles } as any,
          seoTitle: pageSchema.seoTitle,
          seoDesc: pageSchema.seoDesc,
          status: intent === "publish" ? "PUBLISHED" : "DRAFT",
          publishedAt: intent === "publish" ? new Date() : null,
        },
      });

      if (intent === "publish") {
        const pubResult = await publishPageToShopify(admin, session.shop, pageSchema);

        if (pubResult.shopifyPageId) {
          await prisma.page.update({
            where: { id: savedPage.id },
            data: {
              shopifyPageId: pubResult.shopifyPageId,
              templateSuffix: pubResult.templateSuffix,
            },
          });
        }

        return json({
          ok: true,
          pageId: savedPage.id,
          liveUrl: pubResult.liveUrl,
          editorUrl: pubResult.editorUrl,
          templateSuffix: pubResult.templateSuffix,
          status: "PUBLISHED",
        });
      }

      return json({ ok: true, pageId: savedPage.id, status: savedPage.status });
    }

    if (intent === "delete") {
      const { pageId } = body;
      if (pageId) {
        await prisma.page.delete({ where: { id: pageId } });
      }
      return redirect("/app/builder");
    }

    return json({ ok: false, error: "Invalid intent." });
  } catch (err: any) {
    return json({ ok: false, error: err.message });
  }
};

export default function VisualStudioPage() {
  const { initialSchema, status: initialStatus, shopDomain } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher<any>();

  // Page schema and history stack
  const [schema, setSchema] = useState<PageSchema>(initialSchema);
  const [history, setHistory] = useState<PageSchema[]>([initialSchema]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Editor UI State
  const [viewport, setViewport] = useState<DeviceViewport>("desktop");
  const [isLivePreview, setIsLivePreview] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [pageStatus, setPageStatus] = useState(initialStatus);

  // Quick Add Block Modal state
  const [addModalTarget, setAddModalTarget] = useState<{ sectionId: string; columnId: string } | null>(null);

  // Push new state to history
  const updateSchemaWithHistory = useCallback((newSchema: PageSchema) => {
    setSchema(newSchema);
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, newSchema];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Undo / Redo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setSchema(history[nextIdx]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setSchema(history[nextIdx]);
    }
  }, [historyIndex, history]);

  // Save Draft
  const handleSave = () => {
    fetcher.submit(
      { intent: "save", schema },
      { method: "post", encType: "application/json" }
    );
  };

  // Publish to Shopify
  const handlePublish = () => {
    fetcher.submit(
      { intent: "publish", schema },
      { method: "post", encType: "application/json" }
    );
  };

  // Listen to fetcher results
  useEffect(() => {
    if (fetcher.data?.ok && fetcher.data?.status) {
      setPageStatus(fetcher.data.status);
    }
  }, [fetcher.data]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        setSelectedBlockId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo, handleSave]);

  // Find currently selected block
  const selectedBlock: Block | null = React.useMemo(() => {
    if (!selectedBlockId) return null;
    for (const sec of schema.sections) {
      for (const col of sec.columns) {
        const found = col.blocks.find((b) => b.id === selectedBlockId);
        if (found) return found;
      }
    }
    return null;
  }, [schema, selectedBlockId]);

  // Add block to first column or selected column
  const handleAddBlock = (newBlock: Block) => {
    const updatedSections = [...schema.sections];
    if (updatedSections.length === 0) {
      updatedSections.push({
        id: generateId("sec"),
        title: "New Section",
        styles: { paddingTop: 32, paddingBottom: 32 },
        columns: [{ id: generateId("col"), width: 12, blocks: [newBlock] }],
      });
    } else {
      // Append to first section, last column
      const targetSec = updatedSections[0];
      if (targetSec.columns.length === 0) {
        targetSec.columns.push({ id: generateId("col"), width: 12, blocks: [newBlock] });
      } else {
        targetSec.columns[targetSec.columns.length - 1].blocks.push(newBlock);
      }
    }

    updateSchemaWithHistory({ ...schema, sections: updatedSections });
    setSelectedBlockId(newBlock.id);
  };

  // Add full pre-built section
  const handleAddSection = (newSection: Section) => {
    updateSchemaWithHistory({
      ...schema,
      sections: [...schema.sections, newSection],
    });
  };

  // Update block properties
  const handleUpdateBlock = (updatedBlock: Block) => {
    const updatedSections = schema.sections.map((sec) => ({
      ...sec,
      columns: sec.columns.map((col) => ({
        ...col,
        blocks: col.blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)),
      })),
    }));
    updateSchemaWithHistory({ ...schema, sections: updatedSections });
  };

  // Delete block
  const handleDeleteBlock = (blockId: string) => {
    const updatedSections = schema.sections.map((sec) => ({
      ...sec,
      columns: sec.columns.map((col) => ({
        ...col,
        blocks: col.blocks.filter((b) => b.id !== blockId),
      })),
    }));
    updateSchemaWithHistory({ ...schema, sections: updatedSections });
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  };

  // Duplicate block
  const handleDuplicateBlock = (blockId: string) => {
    const updatedSections = schema.sections.map((sec) => ({
      ...sec,
      columns: sec.columns.map((col) => {
        const newBlocks: Block[] = [];
        for (const b of col.blocks) {
          newBlocks.push(b);
          if (b.id === blockId) {
            const clone: Block = {
              ...JSON.parse(JSON.stringify(b)),
              id: generateId("b"),
              label: `${b.label || b.type} (Copy)`,
            };
            newBlocks.push(clone);
          }
        }
        return { ...col, blocks: newBlocks };
      }),
    }));
    updateSchemaWithHistory({ ...schema, sections: updatedSections });
  };

  // Move block up or down
  const handleMoveBlock = (blockId: string, direction: "up" | "down") => {
    const updatedSections = schema.sections.map((sec) => ({
      ...sec,
      columns: sec.columns.map((col) => {
        const idx = col.blocks.findIndex((b) => b.id === blockId);
        if (idx === -1) return col;
        const newBlocks = [...col.blocks];
        const targetIdx = direction === "up" ? idx - 1 : idx + 1;
        if (targetIdx >= 0 && targetIdx < newBlocks.length) {
          const temp = newBlocks[idx];
          newBlocks[idx] = newBlocks[targetIdx];
          newBlocks[targetIdx] = temp;
        }
        return { ...col, blocks: newBlocks };
      }),
    }));
    updateSchemaWithHistory({ ...schema, sections: updatedSections });
  };

  // Delete entire section
  const handleDeleteSection = (sectionId: string) => {
    const updated = schema.sections.filter((s) => s.id !== sectionId);
    updateSchemaWithHistory({ ...schema, sections: updated });
  };

  // Insert block via inline modal
  const handleInsertAtTarget = (block: Block) => {
    if (!addModalTarget) return;
    const { sectionId, columnId } = addModalTarget;
    const updatedSections = schema.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        columns: sec.columns.map((col) => {
          if (col.id !== columnId) return col;
          return { ...col, blocks: [...col.blocks, block] };
        }),
      };
    });
    updateSchemaWithHistory({ ...schema, sections: updatedSections });
    setSelectedBlockId(block.id);
    setAddModalTarget(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", backgroundColor: "#0f172a" }}>
      {/* 1. TOP HEADER TOOLBAR */}
      <TopBar
        pageTitle={schema.title}
        onPageTitleChange={(title) => updateSchemaWithHistory({ ...schema, title })}
        status={pageStatus}
        viewport={viewport}
        onViewportChange={setViewport}
        isLivePreview={isLivePreview}
        onToggleLivePreview={() => setIsLivePreview((prev) => !prev)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        isSaving={fetcher.state !== "idle" && fetcher.formData?.get("intent") === "save"}
        onPublish={handlePublish}
        isPublishing={fetcher.state !== "idle" && fetcher.formData?.get("intent") === "publish"}
        onBack={() => navigate("/app/builder")}
        handle={schema.handle}
        shopDomain={shopDomain}
      />

      {/* 2. PUBLISH SUCCESS NOTIFICATION */}
      {fetcher.data?.ok && fetcher.data?.liveUrl && (
        <div style={{ padding: "10px 16px", backgroundColor: "#064e3b" }}>
          <Banner title="🎉 Page Published Successfully to Shopify!" tone="success" onDismiss={() => {}}>
            <p>
              Your page is now live at{" "}
              <a href={fetcher.data.liveUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "700", textDecoration: "underline" }}>
                {fetcher.data.liveUrl} ↗
              </a>
              {" "}and linked to template <code>templates/page.{fetcher.data.templateSuffix}.json</code>.
            </p>
          </Banner>
        </div>
      )}

      {/* 3. THREE-PANEL STUDIO LAYOUT */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* LEFT: Elements & Sections Palette */}
        {!isLivePreview && (
          <LeftPanel
            onAddBlock={handleAddBlock}
            onAddSection={handleAddSection}
            pageSchema={schema}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onDeleteBlock={handleDeleteBlock}
            onDeleteSection={handleDeleteSection}
            isOpen={leftPanelOpen}
            onToggle={() => setLeftPanelOpen((prev) => !prev)}
          />
        )}

        {/* CENTER: Visual WYSIWYG Canvas */}
        <Canvas
          pageSchema={schema}
          viewport={viewport}
          isLivePreview={isLivePreview}
          selectedBlockId={selectedBlockId}
          onSelectBlock={setSelectedBlockId}
          onMoveBlock={handleMoveBlock}
          onDuplicateBlock={handleDuplicateBlock}
          onDeleteBlock={handleDeleteBlock}
          onOpenAddModal={(secId, colId) => setAddModalTarget({ sectionId: secId, columnId: colId })}
        />

        {/* RIGHT: Inspector & Design Styler */}
        {!isLivePreview && (
          <RightPanel
            selectedBlock={selectedBlock}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
            onDeselectBlock={() => setSelectedBlockId(null)}
            pageSchema={schema}
            onUpdatePageSchema={updateSchemaWithHistory}
            isOpen={rightPanelOpen}
            onToggle={() => setRightPanelOpen((prev) => !prev)}
          />
        )}
      </div>

      {/* 4. INLINE QUICK ADD BLOCK MODAL */}
      {addModalTarget && (
        <Modal
          open={Boolean(addModalTarget)}
          onClose={() => setAddModalTarget(null)}
          title="Add Block to Column"
        >
          <Modal.Section>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {ELEMENT_PALETTE.map((el) => (
                <div
                  key={el.type}
                  onClick={() => handleInsertAtTarget(el.defaultBlock())}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "12px",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "#ffffff",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#0284c7";
                    e.currentTarget.style.backgroundColor = "#f0f9ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }}
                >
                  <div style={{ fontSize: "22px", marginBottom: "4px" }}>{el.icon}</div>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{el.title}</div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>{el.category}</div>
                </div>
              ))}
            </div>
          </Modal.Section>
        </Modal>
      )}
    </div>
  );
}
