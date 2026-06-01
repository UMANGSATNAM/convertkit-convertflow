import prisma from "../db.server";

export async function sendWhatsappMessage(
  merchantId: string,
  toPhone: string,
  templateName: string,
  languageCode: string = "en",
  components: any[] = [],
  messageType: string = "abandoned_cart",
  relatedOrderId?: bigint
) {
  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId }
  });

  if (!merchant || !merchant.whatsappPhoneNumberId || !merchant.whatsappAccessToken) {
    throw new Error("WhatsApp credentials not configured for this merchant.");
  }

  // Format phone number to ensure it has no + or spaces
  const formattedPhone = toPhone.replace(/[^0-9]/g, '');

  const url = `https://graph.facebook.com/v19.0/${merchant.whatsappPhoneNumberId}/messages`;
  
  const payload = {
    messaging_product: "whatsapp",
    to: formattedPhone,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: languageCode
      },
      components: components
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${merchant.whatsappAccessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error("WhatsApp API Error Response:", data);
    
    // Create a failed record
    await prisma.whatsappMessage.create({
      data: {
        merchantId,
        messageType,
        toPhone: formattedPhone,
        templateName,
        templateVariables: JSON.stringify(components),
        status: "failed",
        relatedOrderId
      }
    });
    
    throw new Error(data.error?.message || "Failed to send WhatsApp message");
  }

  // Record the successful message in the database
  const messageRecord = await prisma.whatsappMessage.create({
    data: {
      merchantId,
      messageType,
      toPhone: formattedPhone,
      templateName,
      templateVariables: JSON.stringify(components),
      status: "sent",
      metaMessageId: data.messages?.[0]?.id,
      sentAt: new Date(),
      relatedOrderId
    }
  });

  return messageRecord;
}
