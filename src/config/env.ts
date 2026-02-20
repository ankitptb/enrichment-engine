import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  apolloKey: process.env.APOLLO_API_KEY!,
  geminiKey: process.env.GEMINI_API_KEY!,
  apolloBaseUrl: process.env.APOLLO_BASE_URL!,
  geminiApiBase: process.env.GEMINI_API_BASE!,
  geminiModel: process.env.GEMINI_MODEL!,
  apiAccessToken: process.env.API_ACCESS_TOKEN!,
  cliqWebhookUrl: process.env.CLIQ_WEBHOOK_URL!,
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE!
};