import { RouteStop } from "./crm/types";

// Realistic demo data: 20 clients across Riverside, CA area (Doctor Doo service area)
export const DEMO_CLIENTS: RouteStop[] = [
  // Monday clients (6)
  { clientId: "demo-1", name: "Johnson Family", address: "3842 Brockton Ave, Riverside, CA 92501", lat: 33.9533, lng: -117.3962, estimatedServiceMinutes: 15 },
  { clientId: "demo-2", name: "Martinez Residence", address: "6721 Magnolia Ave, Riverside, CA 92506", lat: 33.9381, lng: -117.3743, estimatedServiceMinutes: 12 },
  { clientId: "demo-3", name: "Chen Home", address: "1455 University Ave, Riverside, CA 92507", lat: 33.9563, lng: -117.3412, estimatedServiceMinutes: 18 },
  { clientId: "demo-4", name: "Williams Property", address: "3601 Canyon Crest Dr, Riverside, CA 92507", lat: 33.9328, lng: -117.3271, estimatedServiceMinutes: 15 },
  { clientId: "demo-5", name: "Brown Family", address: "2450 Iowa Ave, Riverside, CA 92507", lat: 33.9465, lng: -117.3353, estimatedServiceMinutes: 20 },
  { clientId: "demo-6", name: "Davis Yard", address: "4025 Market St, Riverside, CA 92501", lat: 33.9612, lng: -117.3756, estimatedServiceMinutes: 13 },

  // Tuesday clients (5)
  { clientId: "demo-7", name: "Garcia Estate", address: "8245 Arlington Ave, Riverside, CA 92503", lat: 33.9190, lng: -117.4132, estimatedServiceMinutes: 25 },
  { clientId: "demo-8", name: "Taylor House", address: "6380 Day St, Riverside, CA 92507", lat: 33.9284, lng: -117.3520, estimatedServiceMinutes: 15 },
  { clientId: "demo-9", name: "Wilson Backyard", address: "10234 Indiana Ave, Riverside, CA 92503", lat: 33.9102, lng: -117.4285, estimatedServiceMinutes: 12 },
  { clientId: "demo-10", name: "Anderson Home", address: "5540 Van Buren Blvd, Riverside, CA 92503", lat: 33.9215, lng: -117.4055, estimatedServiceMinutes: 18 },
  { clientId: "demo-11", name: "Thomas Yard", address: "3780 Tyler St, Riverside, CA 92503", lat: 33.9348, lng: -117.4190, estimatedServiceMinutes: 15 },

  // Wednesday clients (4)
  { clientId: "demo-12", name: "Jackson Property", address: "1299 Galleria at Tyler, Riverside, CA 92503", lat: 33.9270, lng: -117.4310, estimatedServiceMinutes: 15 },
  { clientId: "demo-13", name: "White Residence", address: "7880 Philbin Ave, Riverside, CA 92503", lat: 33.9105, lng: -117.4400, estimatedServiceMinutes: 20 },
  { clientId: "demo-14", name: "Harris Home", address: "4200 Riverwalk Pkwy, Riverside, CA 92505", lat: 33.9422, lng: -117.4512, estimatedServiceMinutes: 12 },
  { clientId: "demo-15", name: "Clark Family", address: "16200 Hole Ave, Riverside, CA 92504", lat: 33.9558, lng: -117.4078, estimatedServiceMinutes: 18 },

  // Thursday clients (3)
  { clientId: "demo-16", name: "Lewis Yard", address: "3485 Mission Inn Ave, Riverside, CA 92501", lat: 33.9825, lng: -117.3752, estimatedServiceMinutes: 15 },
  { clientId: "demo-17", name: "Robinson Property", address: "2060 Chicago Ave, Riverside, CA 92507", lat: 33.9680, lng: -117.3440, estimatedServiceMinutes: 20 },
  { clientId: "demo-18", name: "Walker Home", address: "5225 La Sierra Ave, Riverside, CA 92505", lat: 33.9380, lng: -117.4580, estimatedServiceMinutes: 15 },

  // Friday clients (2)
  { clientId: "demo-19", name: "Hall Residence", address: "3700 Orange St, Riverside, CA 92501", lat: 33.9590, lng: -117.3890, estimatedServiceMinutes: 18 },
  { clientId: "demo-20", name: "Allen Family", address: "9200 Magnolia Ave, Riverside, CA 92503", lat: 33.9090, lng: -117.4150, estimatedServiceMinutes: 15 },
];

export const DEMO_DAY_ASSIGNMENTS: Record<string, string[]> = {
  Monday: ["demo-1", "demo-2", "demo-3", "demo-4", "demo-5", "demo-6"],
  Tuesday: ["demo-7", "demo-8", "demo-9", "demo-10", "demo-11"],
  Wednesday: ["demo-12", "demo-13", "demo-14", "demo-15"],
  Thursday: ["demo-16", "demo-17", "demo-18"],
  Friday: ["demo-19", "demo-20"],
  Saturday: [],
  Sunday: [],
};

export function getDemoClientsForDay(day: string): RouteStop[] {
  const ids = DEMO_DAY_ASSIGNMENTS[day] || [];
  return DEMO_CLIENTS.filter((c) => ids.includes(c.clientId));
}

export function getAllDemoClients(): RouteStop[] {
  return [...DEMO_CLIENTS];
}

// Home base / depot location (Riverside, CA downtown area)
export const DEPOT_LOCATION = {
  lat: 33.9806,
  lng: -117.3755,
  address: "3750 Main St, Riverside, CA 92501",
};
