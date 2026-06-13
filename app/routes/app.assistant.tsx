import { useState, useEffect, useRef } from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, TextField, Button, Badge, Banner } from "@shopify/polaris";
import { useSubmit, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler } from "@remix-run/node";
import { processUserMessage } from "../services/ai/assistant.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 10_000_000,
  });
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);
  
  const message = formData.get("message") as string;
  const image = formData.get("image") as File | null;

  let base64Image = null;
  let mediaType = null;
  
  if (image && typeof image !== "string" && image.size > 0) {
    const arrayBuffer = await image.arrayBuffer();
    base64Image = Buffer.from(arrayBuffer).toString("base64");
    mediaType = image.type;
  }
  
  const prisma = (await import("../db.server")).default;
  const shop = await prisma.shop.upsert({
    where: { shopDomain: session.shop },
    update: {},
    create: { shopDomain: session.shop, accessToken: session.accessToken || "" }
  });

  const response = await processUserMessage(request, shop.id, session.shop, message, base64Image, mediaType);
  return json({ response });
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  toolCalls?: Array<{ name: string; input: any }>;
};

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: "assistant", 
    content: "Hi! I am the StoreForge AI. You can ask me to change your theme color, enable features, or upload a screenshot and say 'I want a store like this'!" 
  }]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const isSubmitting = nav.state === "submitting";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSend = () => {
    if ((!input.trim() && !selectedImage) || isSubmitting) return;
    
    setMessages(prev => [
      ...prev, 
      { role: "user", content: input, imageUrl: imagePreview || undefined }
    ]);
    
    const formData = new FormData();
    formData.append("message", input);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    
    submit(formData, { method: "post", encType: "multipart/form-data" });
    
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (actionData?.response && !isSubmitting) {
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg.role === "assistant" && lastMsg.content === actionData.response.text) {
          return prev;
        }
        return [
          ...prev,
          { 
            role: "assistant", 
            content: actionData.response.text,
            toolCalls: actionData.response.toolCalls as any
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
                          <BlockStack gap="200">
                            {msg.imageUrl && (
                              <img src={msg.imageUrl} alt="Upload" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }} />
                            )}
                            {msg.content && (
                              <Text as="p" tone={msg.role === "user" ? "text-inverse" : "base"}>
                                {msg.content}
                              </Text>
                            )}
                          </BlockStack>
                          
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
                <BlockStack gap="300">
                  {imagePreview && (
                    <InlineStack align="start">
                      <div style={{ position: "relative" }}>
                        <img src={imagePreview} alt="Preview" style={{ height: "60px", borderRadius: "4px", border: "1px solid #ccc" }} />
                        <button 
                          onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                          style={{ position: "absolute", top: "-5px", right: "-5px", background: "red", color: "white", borderRadius: "50%", width: "20px", height: "20px", border: "none", cursor: "pointer" }}
                        >
                          ×
                        </button>
                      </div>
                    </InlineStack>
                  )}
                  <InlineStack gap="300" align="space-between" blockAlign="center">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      style={{ display: "none" }} 
                      onChange={handleImageChange}
                    />
                    <Button onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                      📎 Image
                    </Button>
                    <div style={{ flexGrow: 1 }}>
                      <div onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                      }}>
                        <TextField
                          labelHidden
                          label="Message"
                          value={input}
                          onChange={setInput}
                          autoComplete="off"
                          placeholder="e.g. 'I want a store like this attached screenshot!'"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <Button variant="primary" onClick={handleSend} loading={isSubmitting} disabled={(!input.trim() && !selectedImage)}>
                      Send
                    </Button>
                  </InlineStack>
                </BlockStack>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
