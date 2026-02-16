import axios from "axios";
import { env } from "../config/env";

export async function fetchPerson(data: {
  email?: string;
  linkedin_url?: string;
}) {
  const response = await axios.post(
    `${env.apolloBaseUrl}/people/match`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": env.apolloKey
      }
    }
  );

  return response.data.person;
}

export async function fetchOrganization(orgId: string) {
  const response = await axios.post(
    `${env.apolloBaseUrl}/organizations/search`,
    {
      organization_ids: [orgId],
      page: 1,
      per_page: 1
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": env.apolloKey
      }
    }
  );

  return response.data.organizations?.[0] || null;
}
