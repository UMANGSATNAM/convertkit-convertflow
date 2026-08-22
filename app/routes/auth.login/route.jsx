import { useState } from "react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  AppProvider as PolarisAppProvider,
  Button,
  Card,
  FormLayout,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  const url = new URL(request.url);
  const bypassShop = url.searchParams.get("shop") || "peri-beauty-bcuauhsj.myshopify.com";
  return { errors, polarisTranslations, isDev: true, bypassShop };
};

export const action = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));

  return {
    errors,
  };
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors, isDev, bypassShop } = actionData || loaderData;

  return (
    <PolarisAppProvider i18n={loaderData.polarisTranslations}>
      <Page>
        <Card>
          <Form method="post">
            <FormLayout>
              <Text variant="headingMd" as="h2">
                Log in
              </Text>
              <TextField
                type="text"
                name="shop"
                label="Shop domain"
                helpText="example.myshopify.com"
                value={shop}
                onChange={setShop}
                autoComplete="on"
                error={errors.shop}
              />
              <Button submit>Log in</Button>
              {isDev && (
                <div style={{marginTop:12, paddingTop:12, borderTop:'1px solid #e5e7eb'}}>
                  <Text as="p" variant="bodySm" tone="subdued">Dev bypass — no need to type shop domain</Text>
                  <div style={{marginTop:8, display:'flex', gap:8}}>
                    <Form method="post">
                      <input type="hidden" name="shop" value={bypassShop} />
                      <Button submit variant="primary">Bypass → {bypassShop}</Button>
                    </Form>
                    <Button url={`?bypass=1&shop=${bypassShop}`}>One-click bypass (GET)</Button>
                  </div>
                  <Text as="p" variant="bodySm" tone="subdued" style={{marginTop:6}}>Or open: <code>?shop={bypassShop}&host=bypass</code> or <code>?bypass=1</code></Text>
                </div>
              )}
            </FormLayout>
          </Form>
        </Card>
      </Page>
    </PolarisAppProvider>
  );
}

{/* <label>Form field</label> */}
