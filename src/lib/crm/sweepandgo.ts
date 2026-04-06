import { CrmAdapter, CrmClient } from "./types";

export class SweepAndGoAdapter implements CrmAdapter {
  name = "sweepandgo";

  private apiKey: string;
  private baseUrl = "https://openapi.sweepandgo.com/api/v1";

  constructor() {
    this.apiKey = process.env.SWEEPANDGO_API_KEY || "";
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async fetchClients(): Promise<CrmClient[]> {
    if (!this.isConfigured()) return [];

    const clients: CrmClient[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await fetch(
        `${this.baseUrl}/clients/active?page=${page}&per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        console.error(`Sweep&Go API error: ${res.status}`);
        break;
      }

      const data = await res.json();
      const items = data.data || data;

      if (!Array.isArray(items) || items.length === 0) {
        hasMore = false;
        break;
      }

      for (const item of items) {
        clients.push({
          clientId: String(item.client || item.id),
          name: item.name || `${item.first_name || ""} ${item.last_name || ""}`.trim(),
          address: item.address || "",
          lat: null,
          lng: null,
          serviceDay: item.service_days || null,
          frequency: normalizeFrequency(item.cleanup_frequency),
          assignedTo: item.assigned_to || null,
          dogCount: item.number_of_dogs || null,
          yardSize: item.yard_size || null,
          estimatedServiceMinutes: estimateServiceTime(item),
        });
      }

      page++;
      // Rate limit: 1 req/sec
      await new Promise((r) => setTimeout(r, 1000));
    }

    return clients;
  }
}

function normalizeFrequency(freq: string | null | undefined): string | null {
  if (!freq) return null;
  const f = freq.toLowerCase().replace(/[_\s]+/g, "-");
  if (f.includes("twice") || f.includes("2x")) return "twice-a-week";
  if (f.includes("bi") || f.includes("every-other")) return "bi-weekly";
  if (f.includes("month")) return "monthly";
  if (f.includes("week") || f.includes("once")) return "weekly";
  return freq;
}

function estimateServiceTime(item: Record<string, unknown>): number {
  const dogs = (item.number_of_dogs as number) || 1;
  const base = 10;
  return base + dogs * 3; // ~13 min for 1 dog, ~19 for 3 dogs
}
