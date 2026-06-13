import { useState, useEffect } from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, TextField, Button, Badge, Banner } from "@shopify/polaris";
import { useSubmit, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { processUserMessage } from "../services/ai/assistant.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const message = formData.get("message") as string;
  
  // We expect processUserMessage to handle finding the shop via session.shop
  // We'll pass request so we can mock/extract admin if needed
  // But processUserMessage is taking shopId. We need to query shopId first.
  const prisma = (await import("../db.server")).default;
  const shop = await prisma.shop.upsert({
    where: { shopDomain: session.shop },
    update: {},
    create: { shopDomain: session.shop, accessToken: session.accessToken || "" }
  });

  const response = await processUserMessage(request, shop.id, session.shop, message);
  return json({ response });
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  toolCalls?: Array<{ name: string; input: any }>;
};

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: "assistant", 
    content: "Hi! I am the StoreForge AI. You can ask me to change your theme color, enable sticky cart, run a health scan, or inject a campaign!" 
  }]);
  const [input, setInput] = useState("");
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const isSubmitting = nav.state === "submitting";

  const handleSend = () => {
    if (!input.trim() || isSubmitting) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    
    const formData = new FormData();
    formData.append("message", input);
    submit(formData, { method: "post" });
    
    setInput("");
  };

  useEffect(() => {
    if (actionData?.response && !isSubmitting) {
      // Avoid duplicating the response if it's already the last message
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        // simple check to prevent duplicate appends on re-renders
        if (lastMsg.role === "assistant" && lastMsg.content === actionData.response.text) {
          return prev;
        }
        return [
          ...prev,
          { 
            role: "assistant", 
            content: actionData.response.text,
            toolCalls: actionData.response.toolCalls
          }
        ];
      });
    }
  }, [actionData, isSubmitting]);

  return (
    <Page title="StoreForge AI Assistant" subtitle="Powered by Claude 3.5 Sonnet">
      <Layout>
        <Layout.Section>
          <Card padding="0">
            <BlockStack gap="0">
              <div style={{ height: "500px", overflowY: "auto", padding: "16px", backgroundColor: "#f4f6f8" }}>
                <BlockStack gap="400">
                  {messages.map((msg, i) => (
                    <InlineStack key={i} align={msg.role === "user" ? "end" : "start"}>
                      <div style={{ maxWidth: "80%" }}>
                        <Card background={msg.role === "user" ? "bg-surface-brand" : "bg-surface"}>
                          <Text as="p" tone={msg.role === "user" ? "text-inverse" : "base"}>
                            {msg.content}
                          </Text>
                          
                          {/* Render Action Cards for tool calls */}
                          {msg.toolCalls && msg.toolCalls.length > 0 && (
                            <div style={{ marginTop: "12px" }}>
                              <BlockStack gap="200">
                                {msg.toolCalls.map((tc, j) => (
                                  <Banner key={j} tone="success" title={`Action Executed: ${tc.name}`}>
                                    <pre style={{ fontSize: "12px", background: "rgba(0,0,0,0.05)", padding: "8px", borderRadius: "4px" }}>
                                      {JSON.stringify(tc.input, null, 2)}
                                    </pre>
                                  </Banner>
                                ))}
                              </BlockStack>
                            </div>
                          )}
                        </Card>
                      </div>
                    </InlineStack>
                  ))}
                  {isSubmitting && (
                    <InlineStack align="start">
                      <Badge tone="info">AI is thinking...</Badge>
                    </InlineStack>
                  )}
                </BlockStack>
              </div>

              <div style={{ padding: "16px", borderTop: "1px solid #e1e3e5" }}>
                <InlineStack gap="300" align="space-between" blockAlign="center">
                  <div style={{ flexGrow: 1 }}>
                    <TextField
                      labelHidden
                      label="Message"
                      value={input}
                      onChange={setInput}
                      autoComplete="off"
                      placeholder="e.g. 'Enable Trust Badges and change my primary color to #FF0000'"
                      disabled={isSubmitting}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleSend();
                      }}
                    />
                  </div>
                  <Button variant="primary" onClick={handleSend} loading={isSubmitting} disabled={!input.trim()}>
                    Send
                  </Button>
                </InlineStack>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
