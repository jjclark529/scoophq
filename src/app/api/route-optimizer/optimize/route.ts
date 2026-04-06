import { NextRequest, NextResponse } from "next/server";
import { getOptimizedRoute, getRoute, estimateRouteLocal, localOptimize } from "../../../../lib/routing";
import { RouteStop } from "../../../../lib/crm/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stops, useValhalla = true } = body as {
      stops: RouteStop[];
      useValhalla?: boolean;
    };

    if (!stops || stops.length < 2) {
      return NextResponse.json(
        { error: "At least 2 stops required" },
        { status: 400 }
      );
    }

    // Calculate current route (as-is order)
    let currentRoute;
    if (useValhalla) {
      currentRoute = await getRoute(stops);
    }
    if (!currentRoute) {
      currentRoute = estimateRouteLocal(stops);
    }

    // Calculate optimized route
    let optimizedResult;
    if (useValhalla) {
      optimizedResult = await getOptimizedRoute(stops);
    }

    let optimizedRoute;
    if (optimizedResult) {
      optimizedRoute = optimizedResult.optimized;
    } else {
      // Fall back to local nearest-neighbor optimization
      const reordered = localOptimize(stops);
      optimizedRoute = estimateRouteLocal(reordered);
    }

    // Calculate savings
    const savings = {
      driveTime: currentRoute.totalDriveTime - optimizedRoute.totalDriveTime,
      driveDistance: currentRoute.totalDriveDistance - optimizedRoute.totalDriveDistance,
      percentage: Math.round(
        ((currentRoute.totalDriveTime - optimizedRoute.totalDriveTime) /
          currentRoute.totalDriveTime) *
          100
      ),
    };

    return NextResponse.json({
      current: currentRoute,
      optimized: optimizedRoute,
      savings,
    });
  } catch (error) {
    console.error("Optimize error:", error);
    return NextResponse.json(
      { error: "Failed to optimize route" },
      { status: 500 }
    );
  }
}
