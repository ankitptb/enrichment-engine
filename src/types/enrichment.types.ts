export interface EnrichRequest {
  email?: string;
  linkedin_url?: string;
}

export interface EnrichedResponse {
  enriched_data: any;
  raw_data: any;
  metadata: {
    processed_at: string;
    enrichment_version: string;
  };
}
