export function parseGemini(raw: any) {
  if (typeof raw === "object") {
    return raw; // already parsed
  }

  if (typeof raw !== "string") {
    throw new Error("Invalid Gemini response type");
  }

  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}
