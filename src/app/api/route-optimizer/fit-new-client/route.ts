import { NextRequest, NextResponse } from "next/server";
import { getDemoClientsForDay } from "../../../../lib/demo-data";
import { estimateRouteLocal, localOptimize } from "../../../../lib/routing";
import { RouteStop, DayFitResult } from "../../../../lib/crm/types";

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, lat, lng, frequency, estimatedServiceMinutes = 15 } = body as {
      address: string;
      lat: number;
      lng: number;
      frequency: string;
      estimatedServiceMinutes?: number;
    };

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Coordinates required" },
        { status: 400 }
      );
    }

    const newStop: RouteStop = {
      clientId: "new-client",
      name: "New Client",
      address,
      lat,
      lng,
      estimatedServiceMinutes,
    };

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const results: DayFitResult[] = [];

    for (const day of days) {
      const dayStops = getDemoClientsForDay(day);
      const currentStopCount = dayStops.length;

      // Calculate current route time
      const currentRoute = estimateRouteLocal(dayStops);

      // Insert new stop and optimize
      const withNew = [...dayStops, newStop];
      const optimizedWithNew = localOptimize(withNew);
      const newRoute = estimateRouteLocal(optimizedWithNew);

      // Find marginal drive time
      const marginalDriveTime = newRoute.totalDriveTime - currentRoute.totalDriveTime;

      // Find nearest existing stop
      let nearestDist = Infinity;
      let insertAfter = 0;
      for (let i = 0; i < dayStops.length; i++) {
        const dist = haversineDistance(lat, lng, dayStops[i].lat, dayStops[i].lng);
        if (dist < nearestDist) {
          nearestDist = dist;
          insertAfter = i;
        }
      }

      // Get capacity settings (using defaults for demo)
      const maxStops = 25;
      const maxHours = 8;
      const currentHours = currentRoute.totalRouteTime / 3600;
      const atCapacity = currentStopCount >= maxStops || currentHours >= maxHours;

      let recommendation: DayFitResult["recommendation"] = "good";
      if (atCapacity) recommendation = "full";
      else if (currentStopCount >= maxStops * 0.9 || currentHours >= maxHours * 0.9)
        recommendation = "warning";

      results.push({
        day,
        dayOfWeek: days.indexOf(day) + 1,
        marginalDriveTime: Math.round(marginalDriveTime),
        insertAfterStop: insertAfter,
        nearestStopDistance: Math.round(nearestDist),
        currentStops: currentStopCount,
        maxStops,
        currentHours: Math.round(currentHours * 10) / 10,
        maxHours,
        atCapacity,
        recommendation,
      });
    }

    // Mark the best day
    const availableResults = results.filter((r) => !r.atCapacity);
    if (availableResults.length > 0) {
      const best = availableResults.reduce((a, b) =>
        a.marginalDriveTime < b.marginalDriveTime ? a : b
      );
      best.recommendation = "best";
    }

    // Handle frequency-specific logic
    let frequencyNote = "";
    if (frequency === "twice-a-week") {
      // Find best pair of days 3-4 apart
      const pairs: Array<{ days: string[]; totalMarginal: number }> = [];
      for (let i = 0; i < results.length; i++) {
        for (let j = i + 1; j < results.length; j++) {
          const gap = Math.abs(results[j].dayOfWeek - results[i].dayOfWeek);
          if (gap >= 2 && gap <= 4) {
            pairs.push({
              days: [results[i].day, results[j].day],
              totalMarginal:
                results[i].marginalDriveTime + results[j].marginalDriveTime,
            });
          }
        }
      }
      if (pairs.length > 0) {
        const bestPair = pairs.reduce((a, b) =>
          a.totalMarginal < b.totalMarginal ? a : b
        );
        frequencyNote = `Best pair for twice-a-week: ${bestPair.days.join(" & ")} (+${Math.round(bestPair.totalMarginal / 60)} min total)`;
      }
    } else if (frequency === "bi-weekly") {
      frequencyNote =
        "Bi-weekly: Check A-week and B-week routes for alternating schedule optimization.";
    }

    return NextResponse.json({
      address,
      results,
      bestDay: results.find((r) => r.recommendation === "best")?.day || results[0]?.day,
      frequencyNote,
    });
  } catch (error) {
    console.error("Fit new client error:", error);
    return NextResponse.json(
      { error: "Failed to analyze fit" },
      { status: 500 }
    );
  }
}
