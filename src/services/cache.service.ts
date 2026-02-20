import { supabase } from "../lib/supabase";

export async function findExistingEnrichment(
  email?: string,
  linkedinUrl?: string
) {
  if (!email && !linkedinUrl) return null;

  let query = supabase
    .from("enrichments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (email) {
    query = query.eq("email", email);
  } else if (linkedinUrl) {
    query = query.eq("linkedin_url", linkedinUrl);
  }

  const { data, error } = await query;

  if (error || !data?.length) return null;

  return data[0];
}