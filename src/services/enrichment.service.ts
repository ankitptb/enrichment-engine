import { fetchPerson, fetchOrganization } from "./apollo.service";
import { enrichWithGemini } from "./gemini.service";

export async function runEnrichment(input: {
  email?: string;
  linkedin_url?: string;
}) {
  const person = await fetchPerson(input);

  if (!person) throw new Error("Person not found");

  let organization = null;

  if (person.organization_id) {
    organization = await fetchOrganization(person.organization_id);
  }

  const rawData = { person, organization };

  const geminiRaw = await enrichWithGemini(rawData);

  return {
    enriched_data: geminiRaw,
    raw_data: rawData,
    metadata: {
      processed_at: new Date().toISOString(),
      enrichment_version: "v1"
    }
  };
}
