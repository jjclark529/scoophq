import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress, searchAddresses } from "../../../../lib/routing";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const mode = searchParams.get("mode") || "search";

  if (!q) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  try {
    if (mode === "geocode") {
      const result = await geocodeAddress(q);
      if (!result) {
        return NextResponse.json(
          { error: "Address not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(result);
    }

    // Search mode - return multiple results
    const results = await searchAddresses(q);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Geocode error:", error);
    return NextResponse.json(
      { error: "Geocoding failed" },
      { status: 500 }
    );
  }
}
