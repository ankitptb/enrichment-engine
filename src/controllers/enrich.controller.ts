import { Request, Response } from "express";
import { z } from "zod";
import { runEnrichment } from "../services/enrichment.service";
import { formatEnrichedResponse } from "../utils/formatResponse";
import { sendToCliq } from "../services/cliq.service";
import { storeEnrichment } from "../services/storage.service";
import { findExistingEnrichment } from "../services/cache.service";

const enrichSchema = z.object({
  email: z.string().email().optional(),
  linkedin_url: z.string().url().optional()
});

function isLessThanOneMonth(dateString: string) {
  const created = new Date(dateString);
  const now = new Date();

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  return created > oneMonthAgo;
}

export async function enrichController(req: Request, res: Response) {
  try {
    const parsed = enrichSchema.parse(req.body);

    if (!parsed.email && !parsed.linkedin_url) {
      return res.status(400).json({
        error: "Provide email or linkedin_url"
      });
    }

    const { email, linkedin_url: linkedinUrl } = parsed;
    const existing = await findExistingEnrichment(email, linkedinUrl);

    if (existing) {
      if (isLessThanOneMonth(existing.created_at)) {
        return res.json({
            enriched_data: existing.enriched_data,
            raw_data: existing.raw_data,
            metadata: existing.metadata
          });
      }
    }

    const result = await runEnrichment(parsed);

    // Format before returning
    const formatted = formatEnrichedResponse(result);

    // send cliq notification
    try {
      await sendToCliq(
        formatted.enriched_data,
        formatted.raw_data
      );
    } catch (cliqError) {
      console.error("Cliq notification failed:", cliqError);
    }

    if (!existing || !isLessThanOneMonth(existing.created_at)) {
      // store in db
      await storeEnrichment({
        email: formatted.enriched_data?.user?.email,
        linkedin_url: formatted.enriched_data?.user?.linkedin_url,
        enriched_data: formatted.enriched_data,
        raw_data: formatted.raw_data,
        metadata: {
          ...formatted.metadata,
          refreshed_at: new Date().toISOString()
        }
      });
    }

    return res.status(200).json(formatted);

  } catch (error: any) {
    console.error("Enrichment Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    return res.status(500).json({
      error: "Enrichment failed",
      details: error.response?.data || error.message
    });
  }
}
