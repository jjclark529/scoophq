import { RouteStop, OptimizedRoute, RouteLeg } from "./crm/types";

const VALHALLA_BASE = "https://valhalla1.openstreetmap.de";
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = "PoopScoopHQ/1.0 (route-optimizer)";

// Rate limiting
let lastValhallaCall = 0;
let lastNominatimCall = 0;

async function rateLimitValhalla() {
  const now = Date.now();
  const elapsed = now - lastValhallaCall;
  if (elapsed < 1000) {
    await new Promise((r) => setTimeout(r, 1000 - elapsed));
  }
  lastValhallaCall = Date.now();
}

async function rateLimitNominatim() {
  const now = Date.now();
  const elapsed = now - lastNominatimCall;
  if (elapsed < 1000) {
    await new Promise((r) => setTimeout(r, 1000 - elapsed));
  }
  lastNominatimCall = Date.now();
}

export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  await rateLimitNominatim();

  try {
    const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}

export async function searchAddresses(
  query: string
): Promise<Array<{ display_name: string; lat: number; lng: number }>> {
  await rateLimitNominatim();

  try {
    const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=us`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.map((item: { display_name: string; lat: string; lon: string }) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch {
    return [];
  }
}

interface ValhallaLocation {
  lat: number;
  lon: number;
}

export async function getRoute(
  stops: RouteStop[]
): Promise<OptimizedRoute | null> {
  if (stops.length < 2) return null;
  await rateLimitValhalla();

  const locations: ValhallaLocation[] = stops.map((s) => ({
    lat: s.lat,
    lon: s.lng,
  }));

  const request = {
    locations,
    costing: "auto",
    directions_options: { units: "miles" },
  };

  try {
    const url = `${VALHALLA_BASE}/route?json=${encodeURIComponent(JSON.stringify(request))}`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!res.ok) {
      console.error("Valhalla route error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const trip = data.trip;

    if (!trip) return null;

    const legs: RouteLeg[] = trip.legs.map(
      (leg: { summary: { time: number; length: number }; shape: string }) => ({
        driveTime: leg.summary.time,
        driveDistance: leg.summary.length * 1609.34, // miles to meters
        geometry: leg.shape,
      })
    );

    let totalDriveTime = 0;
    let totalDriveDistance = 0;
    const routeStops = stops.map((stop, i) => {
      const leg = legs[i - 1];
      const driveTime = leg?.driveTime || 0;
      const driveDist = leg?.driveDistance || 0;
      totalDriveTime += driveTime;
      totalDriveDistance += driveDist;

      return {
        ...stop,
        driveTimeFromPrevious: driveTime,
        driveDistanceFromPrevious: driveDist,
        cumulativeTime:
          totalDriveTime +
          stops.slice(0, i + 1).reduce((a, s) => a + s.estimatedServiceMinutes * 60, 0),
      };
    });

    const totalServiceTime = stops.reduce(
      (a, s) => a + s.estimatedServiceMinutes * 60,
      0
    );

    return {
      stops: routeStops,
      totalDriveTime,
      totalDriveDistance,
      totalServiceTime,
      totalRouteTime: totalDriveTime + totalServiceTime,
      geometry: trip.legs.map((l: { shape: string }) => l.shape).join(""),
      legs,
    };
  } catch (err) {
    console.error("Valhalla route error:", err);
    return null;
  }
}

export async function getOptimizedRoute(
  stops: RouteStop[]
): Promise<{ optimized: OptimizedRoute; originalOrder: number[] } | null> {
  if (stops.length < 2) return null;
  await rateLimitValhalla();

  const locations: ValhallaLocation[] = stops.map((s) => ({
    lat: s.lat,
    lon: s.lng,
  }));

  const request = {
    locations,
    costing: "auto",
    directions_options: { units: "miles" },
  };

  try {
    const url = `${VALHALLA_BASE}/optimized_route?json=${encodeURIComponent(JSON.stringify(request))}`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!res.ok) {
      console.error("Valhalla optimized_route error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const trip = data.trip;

    if (!trip) return null;

    // Valhalla returns locations in optimized order with original_index
    const optimizedLocations = trip.locations as Array<{
      lat: number;
      lon: number;
      original_index: number;
    }>;

    const originalOrder = optimizedLocations.map((l) => l.original_index);
    const reorderedStops = originalOrder.map((idx) => stops[idx]);

    const legs: RouteLeg[] = trip.legs.map(
      (leg: { summary: { time: number; length: number }; shape: string }) => ({
        driveTime: leg.summary.time,
        driveDistance: leg.summary.length * 1609.34,
        geometry: leg.shape,
      })
    );

    let totalDriveTime = 0;
    let totalDriveDistance = 0;
    const routeStops = reorderedStops.map((stop, i) => {
      const leg = legs[i - 1];
      const driveTime = leg?.driveTime || 0;
      const driveDist = leg?.driveDistance || 0;
      totalDriveTime += driveTime;
      totalDriveDistance += driveDist;

      return {
        ...stop,
        driveTimeFromPrevious: driveTime,
        driveDistanceFromPrevious: driveDist,
        cumulativeTime:
          totalDriveTime +
          reorderedStops
            .slice(0, i + 1)
            .reduce((a, s) => a + s.estimatedServiceMinutes * 60, 0),
      };
    });

    const totalServiceTime = stops.reduce(
      (a, s) => a + s.estimatedServiceMinutes * 60,
      0
    );

    return {
      optimized: {
        stops: routeStops,
        totalDriveTime,
        totalDriveDistance,
        totalServiceTime,
        totalRouteTime: totalDriveTime + totalServiceTime,
        geometry: trip.legs.map((l: { shape: string }) => l.shape).join(""),
        legs,
      },
      originalOrder,
    };
  } catch (err) {
    console.error("Valhalla optimized_route error:", err);
    return null;
  }
}

// Estimate route without calling Valhalla (using straight-line distance)
export function estimateRouteLocal(stops: RouteStop[]): OptimizedRoute {
  let totalDriveTime = 0;
  let totalDriveDistance = 0;

  const routeStops = stops.map((stop, i) => {
    let driveTime = 0;
    let driveDist = 0;

    if (i > 0) {
      const prev = stops[i - 1];
      driveDist = haversineDistance(prev.lat, prev.lng, stop.lat, stop.lng);
      // Assume 25 mph average in residential areas
      driveTime = (driveDist / 1609.34 / 25) * 3600;
    }

    totalDriveTime += driveTime;
    totalDriveDistance += driveDist;

    return {
      ...stop,
      driveTimeFromPrevious: Math.round(driveTime),
      driveDistanceFromPrevious: Math.round(driveDist),
      cumulativeTime: Math.round(
        totalDriveTime +
          stops.slice(0, i + 1).reduce((a, s) => a + s.estimatedServiceMinutes * 60, 0)
      ),
    };
  });

  const totalServiceTime = stops.reduce(
    (a, s) => a + s.estimatedServiceMinutes * 60,
    0
  );

  return {
    stops: routeStops,
    totalDriveTime: Math.round(totalDriveTime),
    totalDriveDistance: Math.round(totalDriveDistance),
    totalServiceTime,
    totalRouteTime: Math.round(totalDriveTime + totalServiceTime),
  };
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // meters
}

// Simple nearest-neighbor TSP for local optimization (no API call)
export function localOptimize(stops: RouteStop[]): RouteStop[] {
  if (stops.length <= 2) return [...stops];

  const remaining = [...stops];
  const result: RouteStop[] = [remaining.shift()!];

  while (remaining.length > 0) {
    const last = result[result.length - 1];
    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = haversineDistance(
        last.lat,
        last.lng,
        remaining[i].lat,
        remaining[i].lng
      );
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    result.push(remaining.splice(bestIdx, 1)[0]);
  }

  return result;
}
