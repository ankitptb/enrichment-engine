import { supabase } from "../lib/supabase";

export async function storeEnrichment(data: any) {
  const conflictField = data.email ? "email" : "linkedin_url";

  const { error } = await supabase
  .from("enrichments")
  .upsert({
    ...data,
    updated_at: new Date().toISOString()
  }, {
    onConflict: conflictField
  });

  if (error) {
    console.error("Supabase Error:", error);
    throw error;
  }
}