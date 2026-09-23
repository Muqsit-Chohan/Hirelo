import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config({ path: new URL("../.env", import.meta.url), quiet: true });

let client;
function getClient() {
  if (!client) client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return client;
}

function isConfigured() {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM } = process.env;
  return Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_WHATSAPP_FROM) &&
    !/your_|replace|example/i.test(`${TWILIO_ACCOUNT_SID}${TWILIO_AUTH_TOKEN}${TWILIO_WHATSAPP_FROM}`);
}

// Numbers must include the country code (e.g. +923001234567) for Twilio's WhatsApp API.
function toWhatsAppAddress(phoneNumber) {
  const digits = phoneNumber.replace(/[^\d+]/g, "");
  return `whatsapp:${digits.startsWith("+") ? digits : `+${digits}`}`;
}

export const whatsAppMailer = {
  isConfigured,
  send: async (phoneNumber, body) => {
    if (!isConfigured()) {
      throw Object.assign(new Error("WhatsApp messaging is not configured"), { code: "WHATSAPP_NOT_CONFIGURED" });
    }
    await getClient().messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: toWhatsAppAddress(phoneNumber),
      body,
    });
  },
};
