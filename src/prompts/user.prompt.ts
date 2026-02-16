export function buildUserPrompt(data: any): string {
  return `
Here is the structured input data:

${JSON.stringify(data, null, 2)}

INSTRUCTIONS:

FOUNDER ANALYSIS:
- Mark is_founder true if employment history contains Founder, Co-Founder, Owner.
- Determine founder_of_current_org by matching current organization_id.
- Identify founder_industry from organization industry, domain, and headline.
- Count number_of_founder_roles.

INDUSTRY ANALYSIS:
- Determine primary and secondary industries.
- Determine if PropTech (real estate + technology signals).
- Determine if AI company.
- Determine B2B/B2C using keywords.
- Classify company_type.
- Estimate startup_stage based on founded_year:
    <5 years = Early Stage
    5-10 = Growth
    >10 = Mature
    If unclear → null

EXPERIENCE ANALYSIS:
- Estimate total career years.
- Estimate leadership years.
- Estimate product experience years if applicable.

CLASSIFICATION:
- Determine seniority logically.
- Determine if decision maker.
- Determine AI relevance.
- Map country to region:
    India → APAC
    USA/Canada → North America
    Europe countries → Europe
    Else → null

STRATEGIC PROFILE:
- Infer persona_type.
- Infer growth_orientation.
- Infer risk_profile.

PRODUCT SUGGESTIONS:
Recommend from:
- ProptechBuzz
- Wildlife
- EVTech
- Job Searching

SUGGESTED COMMUNITIES:
Return empty object for now:
"suggested_communities": {}

Return ONLY valid JSON.
`;
}
