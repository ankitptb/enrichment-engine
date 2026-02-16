export function formatEnrichedResponse(data: any) {
  const enriched = data.enriched_data;
  const raw = data.raw_data;

  // -------------------------
  // USER (Minimal Clean)
  // -------------------------
  const user = enriched.user || {};

  const cleanedUser = {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    linkedin_url: user.linkedin_url,
    location: {
      city: user.city || user.location?.city,
      state: user.state || user.location?.state,
      country: user.country || user.location?.country
    }
  };

  // -------------------------
  // ORGANIZATION (Structured)
  // -------------------------
  const org = enriched.organization || {};

  const cleanedOrg = {
    id: org.id,
    name: org.name,
    domain: org.primary_domain || org.domain,
    linkedin_url: org.linkedin_url,
    founded_year: org.founded_year,
    company_type: org.company_type || null,
    industry_primary: org.industry || org.industry_primary,
    industry_secondary: org.secondary_industries || [],
    is_b2b: org.keywords?.includes("b2b") || false,
    is_b2c: org.keywords?.includes("b2c") || false,
    is_startup: org.founded_year
      ? new Date().getFullYear() - org.founded_year <= 7
      : false,
    startup_stage_estimate: null
  };

  // -------------------------
  // NEW: Product Suggestions
  // -------------------------
  const productSuggestions = enriched.product_suggestions || [];

  // -------------------------
  // NEW: Community Suggestions
  // -------------------------
  const communitySuggestions = enriched.community_suggestions || [];

  return [
    {
      enriched_data: {
        user: cleanedUser,
        organization: cleanedOrg,
        founder_analysis: enriched.founder_analysis,
        industry_analysis: enriched.industry_analysis,
        experience_analysis: enriched.experience_analysis,
        classification: enriched.classification,
        strategic_profile: enriched.strategic_profile,
        tags: enriched.tags || [],
        product_suggestions: productSuggestions,
        community_suggestions: communitySuggestions
      },
      raw_data: raw,
      metadata: {
        processed_at: new Date().toISOString(),
        enrichment_version: "v2",
        ai_model: "gemini",
      }
    }
  ];
}
