import { CrmAdapter, CrmClient } from "./types";

export class JobberAdapter implements CrmAdapter {
  name = "jobber";

  private accessToken: string;
  private graphqlUrl = "https://api.getjobber.com/api/graphql";

  constructor() {
    this.accessToken = process.env.JOBBER_ACCESS_TOKEN || "";
  }

  isConfigured(): boolean {
    return !!this.accessToken;
  }

  async fetchClients(): Promise<CrmClient[]> {
    if (!this.isConfigured()) return [];

    const clients: CrmClient[] = [];
    let cursor: string | null = null;
    let hasMore = true;

    while (hasMore) {
      const query = `
        query GetClients($cursor: String) {
          clients(first: 50, after: $cursor) {
            nodes {
              id
              firstName
              lastName
              companyName
              properties {
                nodes {
                  id
                  address {
                    street1
                    street2
                    city
                    province
                    postalCode
                    country
                  }
                }
              }
              jobs(first: 10) {
                nodes {
                  title
                  recurrenceSchedule {
                    frequency
                    scheduledDays
                  }
                  assignedTo {
                    nodes {
                      name { full }
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      const res: Response = await fetch(this.graphqlUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
          "X-JOBBER-GRAPHQL-VERSION": "2024-12-17",
        },
        body: JSON.stringify({ query, variables: { cursor } }),
      });

      if (!res.ok) {
        console.error(`Jobber API error: ${res.status}`);
        break;
      }

      const data = await res.json();
      const clientNodes = data?.data?.clients?.nodes || [];
      const pageInfo = data?.data?.clients?.pageInfo;

      for (const node of clientNodes) {
        const name =
          node.companyName ||
          `${node.firstName || ""} ${node.lastName || ""}`.trim();

        const property = node.properties?.nodes?.[0];
        const addr = property?.address;
        const address = addr
          ? [addr.street1, addr.street2, addr.city, addr.province, addr.postalCode]
              .filter(Boolean)
              .join(", ")
          : "";

        const job = node.jobs?.nodes?.[0];
        const schedule = job?.recurrenceSchedule;
        const assignedTo =
          job?.assignedTo?.nodes?.[0]?.name?.full || null;

        clients.push({
          clientId: node.id,
          name,
          address,
          lat: null,
          lng: null,
          serviceDay: schedule?.scheduledDays?.[0] || null,
          frequency: normalizeJobberFrequency(schedule?.frequency),
          assignedTo,
          dogCount: null,
          yardSize: null,
          estimatedServiceMinutes: 15,
        });
      }

      hasMore = pageInfo?.hasNextPage || false;
      cursor = pageInfo?.endCursor || null;

      // Rate limit
      await new Promise((r) => setTimeout(r, 1000));
    }

    return clients;
  }
}

function normalizeJobberFrequency(
  freq: string | null | undefined
): string | null {
  if (!freq) return null;
  const f = freq.toLowerCase();
  if (f === "weekly" || f === "once_a_week") return "weekly";
  if (f === "biweekly" || f === "every_other_week") return "bi-weekly";
  if (f === "monthly") return "monthly";
  if (f === "twice_a_week") return "twice-a-week";
  return freq;
}
