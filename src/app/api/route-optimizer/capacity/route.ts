import { NextRequest, NextResponse } from "next/server";

// In-memory store for demo (would use Prisma in production)
const capacityStore: Record<
  string,
  { maxHours: number | null; maxClients: number | null }
> = {
  "0": { maxHours: null, maxClients: null }, // Sunday
  "1": { maxHours: 8, maxClients: 25 }, // Monday
  "2": { maxHours: 8, maxClients: 25 }, // Tuesday
  "3": { maxHours: 8, maxClients: 25 }, // Wednesday
  "4": { maxHours: 8, maxClients: 25 }, // Thursday
  "5": { maxHours: 8, maxClients: 25 }, // Friday
  "6": { maxHours: null, maxClients: null }, // Saturday
};

export async function GET() {
  return NextResponse.json({ capacity: capacityStore });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dayOfWeek, maxHours, maxClients } = body as {
      dayOfWeek: number;
      maxHours: number | null;
      maxClients: number | null;
    };

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json(
        { error: "dayOfWeek must be 0-6" },
        { status: 400 }
      );
    }

    capacityStore[String(dayOfWeek)] = { maxHours, maxClients };

    return NextResponse.json({
      success: true,
      dayOfWeek,
      ...capacityStore[String(dayOfWeek)],
    });
  } catch (error) {
    console.error("Capacity error:", error);
    return NextResponse.json(
      { error: "Failed to update capacity" },
      { status: 500 }
    );
  }
}
