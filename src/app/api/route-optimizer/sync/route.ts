import { NextResponse } from "next/server";
import { fetchCrmClients } from "../../../../lib/crm";
import { getDemoClientsForDay, DEMO_DAY_ASSIGNMENTS } from "../../../../lib/demo-data";

export async function POST() {
  try {
    const { provider, clients } = await fetchCrmClients();

    if (provider === "demo" || clients.length === 0) {
      // Return demo data organized by day
      const byDay: Record<string, typeof clients> = {};
      for (const day of Object.keys(DEMO_DAY_ASSIGNMENTS)) {
        const dayClients = getDemoClientsForDay(day);
        byDay[day] = dayClients.map((c) => ({
          clientId: c.clientId,
          name: c.name,
          address: c.address,
          lat: c.lat,
          lng: c.lng,
          serviceDay: day,
          frequency: "weekly",
          assignedTo: "Doctor Doo Team",
          dogCount: Math.floor(Math.random() * 3) + 1,
          yardSize: ["small", "medium", "large"][Math.floor(Math.random() * 3)],
          estimatedServiceMinutes: c.estimatedServiceMinutes,
        }));
      }

      return NextResponse.json({
        provider: "demo",
        clientCount: 20,
        byDay,
        message: "Using demo data. Connect Sweep&Go or Jobber for real data.",
      });
    }

    // Organize real CRM data by service day
    const byDay: Record<string, typeof clients> = {};
    for (const client of clients) {
      const day = client.serviceDay || "Unassigned";
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(client);
    }

    return NextResponse.json({
      provider,
      clientCount: clients.length,
      byDay,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync clients" },
      { status: 500 }
    );
  }
}
