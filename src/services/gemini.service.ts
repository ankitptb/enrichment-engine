import axios from "axios";
import { env } from "../config/env";
import { systemPrompt } from "../prompts/system.prompt";
import { buildUserPrompt } from "../prompts/user.prompt";
import { parseGemini } from "../utils/parseGemini";

export async function enrichWithGemini(data: any) {
  const userPrompt = buildUserPrompt(data);
  const url = `${env.geminiApiBase}/models/${env.geminiModel}:generateContent`;

  try {
    const response = await axios.post(
      url,
      {
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              { text: userPrompt }
            ]
          }
        ],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.2
        }
      },
      {
        params: {
          key: env.geminiKey
        },
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const text =
  response.data.candidates?.[0]?.content?.parts?.[0]?.text;

if (!text) {
  throw new Error("Empty Gemini response");
}

const enrichedData = parseGemini(text);
return enrichedData;

  } catch (error: any) {
    console.error("Gemini Error:", {
      status: error.response?.status,
      data: error.response?.data
    });

    throw error;
  }
}
