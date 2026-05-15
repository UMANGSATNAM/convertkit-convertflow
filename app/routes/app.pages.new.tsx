import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Select,
  Button,
  BlockStack,
  Banner,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { assertCanCreatePage } from "../lib/limits";
import type { PageType } from "@prisma/client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return json({});
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const shop = await prisma.shop.findUnique({
    where: { shopifyDomain: session.shop },
  });
  if (!shop) return json({ error: "Shop not found" }, { status: 404 });

  // Server-side plan limit check — enforced here, not just in UI
  await assertCanCreatePage(shop.id);

  const formData = await request.formData();
  const title = (formData.get("title") as string).trim();
  const handle = slugify(formData.get("handle") as string || title);
  const type = (formData.get("type") as PageType) || "LANDING";

  if (!title) return json({ error: "Title is required" }, { status: 400 });

  const page = await prisma.page.create({
    data: { shopId: shop.id, title, handle, type, status: "DRAFT" },
  });

  return redirect(`/app/pages/${page.id}`);
};

const PAGE_TYPE_OPTIONS: { label: string; value: PageType }[] = [
  { label: "Landing Page", value: "LANDING" },
  { label: "Home Page", value: "HOME" },
  { label: "About", value: "ABOUT" },
  { label: "Contact", value: "CONTACT" },
  { label: "FAQ", value: "FAQ" },
  { label: "Custom", value: "CUSTOM" },
];

export default function NewPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [handle, setHandle] = useState("");
  const [type, setType] = useState<string>("LANDING");
  const [handleEdited, setHandleEdited] = useState(false);

  const isSubmitting = navigation.state === "submitting";

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!handleEdited) {
      setHandle(
        val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
      );
    }
  }

  return (
    <Page
      title="Create Page"
      backAction={{ content: "Pages", url: "/app/pages" }}
    >
      <Layout>
        <Layout.Section>
          {actionData?.error && (
            <Banner tone="critical" title="Error">
              <p>{actionData.error}</p>
            </Banner>
          )}
          <Card>
            <Form method="post">
              <BlockStack gap="400">
                <FormLayout>
                  <TextField
                    label="Page title"
                    name="title"
                    value={title}
                    onChange={handleTitleChange}
                    autoComplete="off"
                    placeholder="e.g. Summer Sale"
                    requiredIndicator
                  />
                  <TextField
                    label="Handle (URL slug)"
                    name="handle"
                    value={handle}
                    onChange={(val) => {
                      setHandleEdited(true);
                      setHandle(val);
                    }}
                    autoComplete="off"
                    prefix="/pages/"
                    helpText="Auto-generated from title. Must be unique."
                  />
                  <Select
                    label="Page type"
                    name="type"
                    options={PAGE_TYPE_OPTIONS}
                    value={type}
                    onChange={setType}
                  />
                  <Button
                    submit
                    variant="primary"
                    loading={isSubmitting}
                    disabled={!title}
                  >
                    Create Page
                  </Button>
                </FormLayout>
              </BlockStack>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
