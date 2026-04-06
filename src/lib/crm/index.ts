import { CrmAdapter, CrmClient } from "./types";
import { SweepAndGoAdapter } from "./sweepandgo";
import { JobberAdapter } from "./jobber";

const adapters: CrmAdapter[] = [
  new SweepAndGoAdapter(),
  new JobberAdapter(),
];

export function getActiveCrmAdapter(): CrmAdapter | null {
  for (const adapter of adapters) {
    if (adapter.isConfigured()) return adapter;
  }
  return null;
}

export async function fetchCrmClients(): Promise<{
  provider: string;
  clients: CrmClient[];
}> {
  const adapter = getActiveCrmAdapter();
  if (adapter) {
    const clients = await adapter.fetchClients();
    return { provider: adapter.name, clients };
  }
  return { provider: "demo", clients: [] };
}
