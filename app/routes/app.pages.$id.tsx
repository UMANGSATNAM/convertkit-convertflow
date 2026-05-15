import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData,
  useSubmit,
  useFetcher,
  useNavigation,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Badge,
  Divider,
  Modal,
  ResourceList,
  ResourceItem,
  Box,
  Banner,
  TextField,
  FormLayout,
  Select,
  Checkbox,
} from "@shopify/polaris";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { SECTIONS, type SectionId } from "../lib/sections/registry";
import { renderPageToHTML } from "../lib/render-page";
import type { Prisma } from "@prisma/client";

// ─── Loader ────────────────────────────────────────────────────────────────

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const page = await prisma.page.findUniqueOrThrow({
    where: { id: params.id },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  const shop = await prisma.shop.findUnique({
    where: { shopifyDomain: session.shop },
  });

  return json({ page, shopDomain: session.shop, plan: shop?.plan ?? "FREE" });
};

// ─── Action ────────────────────────────────────────────────────────────────

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  switch (intent) {
    case "update-section": {
      await prisma.section.update({
        where: { id: formData.get("sectionId") as string },
        data: { settings: JSON.parse(formData.get("settings") as string) as Prisma.JsonObject },
      });
      return json({ ok: true });
    }

    case "reorder-sections": {
      const orderedIds = JSON.parse(formData.get("orderedIds") as string) as string[];
      await prisma.$transaction(
        orderedIds.map((id, i) =>
          prisma.section.update({ where: { id }, data: { order: i } })
        )
      );
      return json({ ok: true });
    }

    case "add-section": {
      const type = formData.get("type") as string;
      const def = SECTIONS[type as SectionId];
      if (!def) throw new Response("Unknown section type", { status: 400 });

      const agg = await prisma.section.aggregate({
        where: { pageId: params.id! },
        _max: { order: true },
      });

      const section = await prisma.section.create({
        data: {
          pageId: params.id!,
          type,
          order: (agg._max.order ?? -1) + 1,
          settings: def.defaults as Prisma.JsonObject,
        },
      });
      return json({ ok: true, sectionId: section.id });
    }

    case "delete-section": {
      await prisma.section.delete({
        where: { id: formData.get("sectionId") as string },
      });
      return json({ ok: true });
    }

    case "publish": {
      const page = await prisma.page.findUniqueOrThrow({
        where: { id: params.id! },
        include: { sections: { orderBy: { order: "asc" } } },
      });

      // Validate every section type is registered
      for (const s of page.sections) {
        if (!SECTIONS[s.type as SectionId]) {
          throw new Response(`Unknown section type at publish: ${s.type}`, { status: 400 });
        }
      }

      const html = await renderPageToHTML(page);

      // Resolve shop GID
      const shopRes = await admin.graphql(`query { shop { id } }`);
      const shopData = (await shopRes.json()) as { data: { shop: { id: string } } };
      const shopGid = shopData.data.shop.id;

      // Write rendered HTML to shop metafield
      const mfRes = await admin.graphql(
        `#graphql
          mutation Set($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
              metafields { id namespace key }
              userErrors { field message code }
            }
          }`,
        {
          variables: {
            metafields: [
              {
                ownerId: shopGid,
                namespace: "omnibuilder",
                key: `page_${page.handle}`,
                type: "multi_line_text_field",
                value: html,
              },
            ],
          },
        }
      );
      const mfData = (await mfRes.json()) as {
        data: {
          metafieldsSet: {
            metafields: { id: string }[];
            userErrors: { field: string; message: string }[];
          };
        };
      };
      const result = mfData.data.metafieldsSet;
      if (result.userErrors.length) {
        throw new Response(`metafieldsSet error: ${JSON.stringify(result.userErrors)}`, { status: 500 });
      }

      await prisma.$transaction([
        prisma.page.update({
          where: { id: page.id },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
            version: { increment: 1 },
          },
        }),
        prisma.pageVersion.create({
          data: {
            pageId: page.id,
            snapshot: page as unknown as Prisma.JsonObject,
            message: "Publish",
          },
        }),
      ]);

      return json({ ok: true, metafieldId: result.metafields[0]?.id });
    }

    default:
      throw new Response(`Unknown intent: ${intent}`, { status: 400 });
  }
};

// ─── Sortable Section Item ──────────────────────────────────────────────────

type SectionRow = {
  id: string;
  type: string;
  order: number;
  settings: Prisma.JsonValue;
};

function SortableSectionItem({
  section,
  isSelected,
  onSelect,
  onDelete,
}: {
  section: SectionRow;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const def = SECTIONS[section.type as SectionId];
  const name = def?.name ?? section.type;

  return (
    <div ref={setNodeRef} style={style}>
      <Box
        padding="300"
        borderWidth="025"
        borderColor={isSelected ? "border-focus" : "border"}
        borderRadius="200"
        background={isSelected ? "bg-surface-selected" : "bg-surface"}
      >
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap="200" blockAlign="center">
            <span
              {...attributes}
              {...listeners}
              style={{ cursor: "grab", fontSize: 20, color: "#999" }}
              aria-label="Drag to reorder"
            >
              ⠿
            </span>
            <div onClick={onSelect} style={{ cursor: "pointer" }}>
              <Text as="span" fontWeight={isSelected ? "bold" : "regular"}>
                {name}
              </Text>
            </div>
          </InlineStack>
          <Button variant="tertiary" tone="critical" size="slim" onClick={onDelete}>
            ✕
          </Button>
        </InlineStack>
      </Box>
    </div>
  );
}

// ─── Settings Panel for hero-split-image ────────────────────────────────────

type HeroSettings = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  image: { url: string; alt: string; width: number; height: number };
  imagePosition: "left" | "right";
  background: "white" | "cream" | "dark" | "gradient";
  paddingTop: "none" | "sm" | "md" | "lg" | "xl";
  paddingBottom: "none" | "sm" | "md" | "lg" | "xl";
  ctaPrimary?: { label: string; url: string };
  ctaSecondary?: { label: string; url: string };
};

function HeroSettingsPanel({
  settings,
  onChange,
}: {
  settings: HeroSettings;
  onChange: (next: HeroSettings) => void;
}) {
  const [hasPrimary, setHasPrimary] = useState(!!settings.ctaPrimary);
  const [hasSecondary, setHasSecondary] = useState(!!settings.ctaSecondary);

  const set = <K extends keyof HeroSettings>(key: K, val: HeroSettings[K]) =>
    onChange({ ...settings, [key]: val });

  const padOptions = [
    { label: "None", value: "none" },
    { label: "Small", value: "sm" },
    { label: "Medium", value: "md" },
    { label: "Large", value: "lg" },
    { label: "XL", value: "xl" },
  ];

  const bgOptions = [
    { label: "White", value: "white" },
    { label: "Cream", value: "cream" },
    { label: "Dark", value: "dark" },
    { label: "Gradient", value: "gradient" },
  ];

  const posOptions = [
    { label: "Right", value: "right" },
    { label: "Left", value: "left" },
  ];

  return (
    <FormLayout>
      <TextField
        label="Eyebrow"
        value={settings.eyebrow ?? ""}
        onChange={(v) => set("eyebrow", v)}
        autoComplete="off"
        maxLength={60}
      />
      <TextField
        label="Headline"
        value={settings.headline}
        onChange={(v) => set("headline", v)}
        autoComplete="off"
        requiredIndicator
        maxLength={140}
      />
      <TextField
        label="Subheadline"
        value={settings.subheadline ?? ""}
        onChange={(v) => set("subheadline", v)}
        autoComplete="off"
        multiline={3}
        maxLength={280}
      />
      <Divider />
      <Text as="h3" variant="headingSm">
        Image
      </Text>
      <TextField
        label="Image URL"
        value={settings.image.url}
        onChange={(v) =>
          set("image", { ...settings.image, url: v })
        }
        autoComplete="off"
        helpText="Upload an image from Shopify Files and paste the CDN URL"
      />
      <TextField
        label="Alt text"
        value={settings.image.alt}
        onChange={(v) =>
          set("image", { ...settings.image, alt: v })
        }
        autoComplete="off"
      />
      <Select
        label="Image position"
        options={posOptions}
        value={settings.imagePosition}
        onChange={(v) => set("imagePosition", v as "left" | "right")}
      />
      <Divider />
      <Select
        label="Background"
        options={bgOptions}
        value={settings.background}
        onChange={(v) => set("background", v as HeroSettings["background"])}
      />
      <InlineStack gap="400">
        <Select
          label="Padding top"
          options={padOptions}
          value={settings.paddingTop}
          onChange={(v) => set("paddingTop", v as HeroSettings["paddingTop"])}
        />
        <Select
          label="Padding bottom"
          options={padOptions}
          value={settings.paddingBottom}
          onChange={(v) => set("paddingBottom", v as HeroSettings["paddingBottom"])}
        />
      </InlineStack>
      <Divider />
      <Checkbox
        label="Add primary CTA"
        checked={hasPrimary}
        onChange={(v) => {
          setHasPrimary(v);
          set("ctaPrimary", v ? { label: "Shop Now", url: "/" } : undefined);
        }}
      />
      {hasPrimary && (
        <FormLayout.Group>
          <TextField
            label="Primary label"
            value={settings.ctaPrimary?.label ?? ""}
            onChange={(v) =>
              set("ctaPrimary", { ...settings.ctaPrimary!, label: v })
            }
            autoComplete="off"
          />
          <TextField
            label="Primary URL"
            value={settings.ctaPrimary?.url ?? ""}
            onChange={(v) =>
              set("ctaPrimary", { ...settings.ctaPrimary!, url: v })
            }
            autoComplete="off"
          />
        </FormLayout.Group>
      )}
      <Checkbox
        label="Add secondary CTA"
        checked={hasSecondary}
        onChange={(v) => {
          setHasSecondary(v);
          set("ctaSecondary", v ? { label: "Learn More", url: "/" } : undefined);
        }}
      />
      {hasSecondary && (
        <FormLayout.Group>
          <TextField
            label="Secondary label"
            value={settings.ctaSecondary?.label ?? ""}
            onChange={(v) =>
              set("ctaSecondary", { ...settings.ctaSecondary!, label: v })
            }
            autoComplete="off"
          />
          <TextField
            label="Secondary URL"
            value={settings.ctaSecondary?.url ?? ""}
            onChange={(v) =>
              set("ctaSecondary", { ...settings.ctaSecondary!, url: v })
            }
            autoComplete="off"
          />
        </FormLayout.Group>
      )}
    </FormLayout>
  );
}

// ─── Page Editor ───────────────────────────────────────────────────────────

export default function PageEditor() {
  const { page } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const saveFetcher = useFetcher();
  const publishFetcher = useFetcher<{ ok: boolean; metafieldId?: string }>();

  const [sections, setSections] = useState<SectionRow[]>(
    page.sections as SectionRow[]
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    page.sections[0]?.id ?? null
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [publishedBanner, setPublishedBanner] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const isPublishing = publishFetcher.state !== "idle";

  // Show banner when publish succeeds
  useEffect(() => {
    if (publishFetcher.data?.ok && publishFetcher.state === "idle") {
      setPublishedBanner(true);
      setTimeout(() => setPublishedBanner(false), 5000);
    }
  }, [publishFetcher.data, publishFetcher.state]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setSections((prev) => {
        const oldIdx = prev.findIndex((s) => s.id === active.id);
        const newIdx = prev.findIndex((s) => s.id === over.id);
        const next = arrayMove(prev, oldIdx, newIdx);

        const fd = new FormData();
        fd.append("intent", "reorder-sections");
        fd.append("orderedIds", JSON.stringify(next.map((s) => s.id)));
        submit(fd, { method: "post" });

        return next;
      });
    },
    [submit]
  );

  const handleSettingsChange = useCallback(
    (sectionId: string, newSettings: object) => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId ? { ...s, settings: newSettings } : s
        )
      );

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const fd = new FormData();
        fd.append("intent", "update-section");
        fd.append("sectionId", sectionId);
        fd.append("settings", JSON.stringify(newSettings));
        saveFetcher.submit(fd, { method: "post" });
      }, 300);
    },
    [saveFetcher]
  );

  const handleAddSection = useCallback(
    (type: string) => {
      const fd = new FormData();
      fd.append("intent", "add-section");
      fd.append("type", type);
      submit(fd, { method: "post" });
      setShowAddModal(false);
    },
    [submit]
  );

  const handleDeleteSection = useCallback(
    (sectionId: string) => {
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      if (selectedId === sectionId) setSelectedId(null);
      const fd = new FormData();
      fd.append("intent", "delete-section");
      fd.append("sectionId", sectionId);
      submit(fd, { method: "post" });
    },
    [submit, selectedId]
  );

  const handlePublish = useCallback(() => {
    const fd = new FormData();
    fd.append("intent", "publish");
    publishFetcher.submit(fd, { method: "post" });
  }, [publishFetcher]);

  const selectedSection = sections.find((s) => s.id === selectedId);

  return (
    <Page
      title={page.title}
      subtitle={`/${page.handle} · ${page.type.toLowerCase()}`}
      backAction={{ content: "Pages", url: "/app/pages" }}
      primaryAction={{
        content: isPublishing ? "Publishing…" : "Publish",
        loading: isPublishing,
        onAction: handlePublish,
      }}
      secondaryActions={[
        {
          content:
            navigation.state === "submitting" ? "Saving…" : "Save Draft",
          disabled: navigation.state === "submitting",
          onAction: () => {
            const fd = new FormData();
            fd.append("intent", "save-draft");
            submit(fd, { method: "post" });
          },
        },
      ]}
    >
      <BlockStack gap="400">
        {publishedBanner && (
          <Banner
            tone="success"
            title="Page published!"
            onDismiss={() => setPublishedBanner(false)}
          >
            <Text as="p">
              Your page is now live. The storefront will reflect changes after
              CDN refresh.
            </Text>
          </Banner>
        )}

        <Layout>
          {/* ── Left: section list ── */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <Text variant="headingMd" as="h2">
                    Sections
                  </Text>
                  <Badge>{String(sections.length)}</Badge>
                </InlineStack>
                <Divider />

                {sections.length === 0 && (
                  <Box padding="400">
                    <Text as="p" tone="subdued" alignment="center">
                      No sections yet. Add one below.
                    </Text>
                  </Box>
                )}

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sections.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <BlockStack gap="200">
                      {sections.map((section) => (
                        <SortableSectionItem
                          key={section.id}
                          section={section}
                          isSelected={selectedId === section.id}
                          onSelect={() => setSelectedId(section.id)}
                          onDelete={() => handleDeleteSection(section.id)}
                        />
                      ))}
                    </BlockStack>
                  </SortableContext>
                </DndContext>

                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowAddModal(true)}
                >
                  + Add Section
                </Button>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* ── Right: settings panel ── */}
          <Layout.Section>
            <Card>
              {selectedSection ? (
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    {SECTIONS[selectedSection.type as SectionId]?.name ??
                      selectedSection.type}
                  </Text>
                  <Divider />
                  {selectedSection.type === "hero-split-image" && (
                    <HeroSettingsPanel
                      settings={selectedSection.settings as unknown as HeroSettings}
                      onChange={(next) =>
                        handleSettingsChange(selectedSection.id, next)
                      }
                    />
                  )}
                </BlockStack>
              ) : (
                <Box padding="800">
                  <Text as="p" tone="subdued" alignment="center">
                    Select a section from the left panel to edit its settings.
                  </Text>
                </Box>
              )}
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>

      {/* Add section modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Section"
      >
        <Modal.Section>
          <ResourceList
            resourceName={{ singular: "section", plural: "sections" }}
            items={Object.values(SECTIONS)}
            renderItem={(def) => (
              <ResourceItem
                id={def.id}
                onClick={() => handleAddSection(def.id)}
                shortcutActions={[
                  {
                    content: "Add",
                    onAction: () => handleAddSection(def.id),
                  },
                ]}
              >
                <BlockStack gap="100">
                  <Text variant="bodyMd" fontWeight="bold" as="span">
                    {def.name}
                  </Text>
                  <Badge>{def.category}</Badge>
                </BlockStack>
              </ResourceItem>
            )}
          />
        </Modal.Section>
      </Modal>
    </Page>
  );
}
