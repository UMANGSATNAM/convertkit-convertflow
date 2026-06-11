import { useState } from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, TextField, Button, Avatar } from "@shopify/polaris";
import { useSubmit, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { processUserMessage } from "../services/ai/assistant.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const message = formData.get("message") as string;
  
  const response = await processUserMessage("mock_shop_id", message);
  return json({ response });
};

export default function Assistant() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi! I am the StoreForge AI. You can ask me to change your theme color to blue, enable sticky cart, or fix health issues." }]);
  const [input, setInput] = useState("");
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    
    const formData = new FormData();
    formData.append("message", input);
    submit(formData, { method: "post" });
    
    setInput("");
  };

  // Mock effect to append actionData response
  // In reality, we'd use a robust useEffect or streaming response
  if (actionData?.response && messages[messages.length - 1].role === "user") {
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: actionData.response.text }
    ]);
  }

  return (
    <Page title="StoreForge AI Assistant">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <div style={{ minHeight: "400px", maxHeight: "600px", overflowY: "auto", padding: "10px" }}>
                <BlockStack gap="400">
                  {messages.map((msg, i) => (
                    <InlineStack key={i} align={msg.role === "user" ? "end" : "start"}>
                      <Card background={msg.role === "user" ? "bg-surface-brand" : "bg-surface-secondary"}>
                        <Text as="p" tone={msg.role === "user" ? "text-inverse" : "base"}>
                          {msg.content}
                        </Text>
                      </Card>
                    </InlineStack>
                  ))}
                </BlockStack>
              </div>

              <InlineStack gap="300" align="space-between" blockAlign="center">
                <div style={{ flexGrow: 1 }}>
                  <TextField
                    labelHidden
                    label="Message"
                    value={input}
                    onChange={setInput}
                    autoComplete="off"
                    placeholder="Ask StoreForge AI..."
                  />
                </div>
                <Button primary onClick={handleSend}>Send</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
