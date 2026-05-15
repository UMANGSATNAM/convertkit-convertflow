import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  IndexTable,
  Badge,
  Text,
  Button,
  EmptySearchResult,
  Box,
  BlockStack,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import type { PageStatus, PageType } from "@prisma/client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({
    where: { shopifyDomain: session.shop },
  });
  if (!shop) return json({ pages: [] });

  const pages = await prisma.page.findMany({
    where: { shopId: shop.id, deletedAt: null },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      handle: true,
      type: true,
      status: true,
      updatedAt: true,
    },
  });

  return json({ pages });
};

function statusTone(
  s: PageStatus
): "success" | "attention" | "critical" | undefined {
  if (s === "PUBLISHED") return "success";
  if (s === "DRAFT") return "attention";
  if (s === "ARCHIVED") return "critical";
  return undefined;
}

export default function PagesIndex() {
  const { pages } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const emptyState = (
    <EmptySearchResult
      title="No pages yet"
      description="Create your first page to get started"
      withIllustration
    />
  );

  return (
    <Page
      title="Pages"
      primaryAction={{
        content: "Create Page",
        onAction: () => navigate("/app/pages/new"),
      }}
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Box paddingBlockEnd="400">
        <BlockStack gap="0">
          <IndexTable
            resourceName={{ singular: "page", plural: "pages" }}
            itemCount={pages.length}
            headings={[
              { title: "Title" },
              { title: "Handle" },
              { title: "Type" },
              { title: "Status" },
              { title: "Last updated" },
              { title: "" },
            ]}
            selectable={false}
            emptyState={emptyState}
          >
            {(pages as Array<{
              id: string;
              title: string;
              handle: string;
              type: string;
              status: string;
              updatedAt: string;
            }>).map((p, i) => (
              <IndexTable.Row id={p.id} key={p.id} position={i}>
                <IndexTable.Cell>
                  <Text variant="bodyMd" fontWeight="bold" as="span">
                    {p.title}
                  </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Text as="span" tone="subdued">
                    /{p.handle}
                  </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Text as="span">{(p.type as PageType).toLowerCase()}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Badge tone={statusTone(p.status as PageStatus)}>
                    {(p.status as PageStatus).toLowerCase()}
                  </Badge>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Text as="span" tone="subdued">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Button
                    variant="tertiary"
                    onClick={() => navigate(`/app/pages/${p.id}`)}
                  >
                    Edit
                  </Button>
                </IndexTable.Cell>
              </IndexTable.Row>
            ))}
          </IndexTable>
        </BlockStack>
      </Box>
    </Page>
  );
}
