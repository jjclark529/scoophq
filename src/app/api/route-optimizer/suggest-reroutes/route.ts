import { NextResponse } from "next/server";
import { getDemoClientsForDay } from "../../../../lib/demo-data";
import { estimateRouteLocal, localOptimize } from "../../../../lib/routing";
import { RerouteSuggestion, RouteStop } from "../../../../lib/crm/types";

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST() {
  try {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const suggestions: RerouteSuggestion[] = [];

    // For each day, check each client and see if moving them saves time
    for (const currentDay of days) {
      const currentStops = getDemoClientsForDay(currentDay);
      if (currentStops.length < 2) continue;

      const currentRoute = estimateRouteLocal(localOptimize(currentStops));

      for (const client of currentStops) {
        // Calculate route without this client
        const withoutClient = currentStops.filter(
          (s) => s.clientId !== client.clientId
        );
        const routeWithout = estimateRouteLocal(localOptimize(withoutClient));
        const savings = currentRoute.totalDriveTime - routeWithout.totalDriveTime;

        // Only consider if removing saves significant time (> 3 min)
        if (savings < 180) continue;

        // Check other days for better fit
        for (const otherDay of days) {
          if (otherDay === currentDay) continue;

          const otherStops = getDemoClientsForDay(otherDay);
          const otherRoute = estimateRouteLocal(localOptimize(otherStops));

          // Add client to other day
          const withClient: RouteStop[] = [...otherStops, client];
          const otherRouteWithClient = estimateRouteLocal(
            localOptimize(withClient)
          );
          const cost =
            otherRouteWithClient.totalDriveTime - otherRoute.totalDriveTime;

          const netSavings = savings - cost;

          // Only suggest if net savings > 2 min
          if (netSavings > 120) {
            // Find nearest stop on the other day
            let nearestDist = Infinity;
            for (const stop of otherStops) {
              const dist = haversineDistance(
                client.lat,
                client.lng,
                stop.lat,
                stop.lng
              );
              if (dist < nearestDist) nearestDist = dist;
            }

            let reason = "";
            if (savings > 600) {
              reason = `${client.name} is an outlier on ${currentDay} — adds ${Math.round(savings / 60)} min of drive time`;
            } else if (nearestDist < 1000) {
              reason = `${client.name} is very close to existing ${otherDay} stops (${Math.round(nearestDist)}m away)`;
            } else {
              reason = `Moving ${client.name} saves ${Math.round(savings / 60)} min on ${currentDay}, only adds ${Math.round(cost / 60)} min to ${otherDay}`;
            }

            suggestions.push({
              clientId: client.clientId,
              clientName: client.name,
              currentDay,
              suggestedDay: otherDay,
              currentDaySavings: Math.round(savings),
              suggestedDayCost: Math.round(cost),
              netSavings: Math.round(netSavings),
              reason,
            });
          }
        }
      }
    }

    // Sort by net savings descending, take top suggestions
    suggestions.sort((a, b) => b.netSavings - a.netSavings);
    const topSuggestions = suggestions.slice(0, 10);

    return NextResponse.json({
      suggestions: topSuggestions,
      totalPotentialSavings: topSuggestions.reduce(
        (a, s) => a + s.netSavings,
        0
      ),
    });
  } catch (error) {
    console.error("Suggest reroutes error:", error);
    return NextResponse.json(
      { error: "Failed to analyze reroutes" },
      { status: 500 }
    );
  }
}
