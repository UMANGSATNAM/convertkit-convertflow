import { Resend } from 'resend';

const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'StoreForge <noreply@storeforge.app>';

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}) {
  if (!resendClient) {
    console.log("Mock Email sent:", { to, subject });
    return;
  }

  try {
    const data = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || "",
      text: text || "",
    });
    return data;
  } catch (error) {
    console.error("Failed to send email via Resend", error);
    throw error;
  }
}
