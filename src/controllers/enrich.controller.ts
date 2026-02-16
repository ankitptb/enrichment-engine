import { Request, Response } from "express";
import { z } from "zod";
import { runEnrichment } from "../services/enrichment.service";
import { formatEnrichedResponse } from "../utils/formatResponse";

const enrichSchema = z.object({
  email: z.string().email().optional(),
  linkedin_url: z.string().url().optional()
});

export async function enrichController(req: Request, res: Response) {
  try {
    const parsed = enrichSchema.parse(req.body);

    if (!parsed.email && !parsed.linkedin_url) {
      return res.status(400).json({
        error: "Provide email or linkedin_url"
      });
    }

    const result = await runEnrichment(parsed);

    // Format before returning
    const formatted = formatEnrichedResponse(result);

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
