import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  apolloKey: process.env.APOLLO_API_KEY!,
  geminiKey: process.env.GEMINI_API_KEY!,
  apolloBaseUrl: process.env.APOLLO_BASE_URL!,
  geminiApiBase: process.env.GEMINI_API_BASE!,
  geminiModel: process.env.GEMINI_MODEL!,
};
