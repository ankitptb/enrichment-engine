import axios from "axios";
import { env } from "../config/env";

export async function sendToCliq(
  enrichedData: any,
  rawData: any
) {
  if (!enrichedData?.product_suggestions?.length) return;

  const {
    user,
    organization,
    founder_analysis,
    industry_analysis,
    experience_analysis,
    strategic_profile,
    product_suggestions
  } = enrichedData;

  // Try to match raw org by id
  const rawOrg =
    rawData?.organization?.id === organization?.id
      ? rawData.organization
      : null;

  const formattedProducts = product_suggestions
    .filter((p: any) => p.relevance_score > 0)
    .map(
      (p: any) =>
        `• ${p.product_name} (Score: ${p.relevance_score})\n  Reason: ${p.reason}`
    )
    .join("\n\n");

  const message = `
🚀 *New Enriched Lead*

━━━━━━━━━━━━━━━━━━
👤 *User Information*
━━━━━━━━━━━━━━━━━━
ID: ${user?.id}
Email: ${user?.email || "N/A"}
LinkedIn: ${user?.linkedin_url || "N/A"}

📍 Location: 
${user?.location?.city || ""} ${user?.location?.state || ""} ${user?.location?.country || ""}

🎯 Seniority: ${enrichedData?.classification?.seniority}
🧠 Persona: ${strategic_profile?.persona_type}
📈 Career Years: ${experience_analysis?.total_career_years || "N/A"}

👑 Founder:
• Is Founder: ${founder_analysis?.is_founder ? "Yes" : "No"}
• Founder of Current Org: ${founder_analysis?.founder_of_current_org ? "Yes" : "No"}
• Founder Industry: ${founder_analysis?.founder_industry || "N/A"}

━━━━━━━━━━━━━━━━━━
🏢 *Organization*
━━━━━━━━━━━━━━━━━━
Name: ${organization?.name}
Website: ${organization?.domain || "N/A"}
LinkedIn: ${organization?.linkedin_url || "N/A"}
Industry: ${organization?.industry_primary}
Founded: ${organization?.founded_year || "N/A"}
B2B/B2C: ${industry_analysis?.b2b_b2c_classification}
PropTech: ${industry_analysis?.is_proptech ? "Yes" : "No"}
${
  rawOrg
    ? `Revenue: ${rawOrg?.estimated_annual_revenue || "N/A"}
Employees: ${rawOrg?.estimated_num_employees || "N/A"}
Location: ${rawOrg?.city || ""} ${rawOrg?.state || ""} ${rawOrg?.country || ""}
`
    : ""
}
━━━━━━━━━━━━━━━━━━
📦 *Product Suggestions*
━━━━━━━━━━━━━━━━━━
${formattedProducts || "No relevant suggestions"}
  `;

  await axios.post(env.cliqWebhookUrl, {
    text: message
  });
}