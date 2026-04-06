// Normalized CRM client type used across the app
export interface CrmClient {
  clientId: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  serviceDay: string | null; // "Monday", "Tuesday", etc.
  frequency: string | null; // "weekly", "bi-weekly", "twice-a-week", "monthly"
  assignedTo: string | null;
  dogCount: number | null;
  yardSize: string | null;
  estimatedServiceMinutes: number;
}

export interface CrmAdapter {
  name: string;
  isConfigured(): boolean;
  fetchClients(): Promise<CrmClient[]>;
}

export interface RouteStop {
  clientId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  estimatedServiceMinutes: number;
  driveTimeFromPrevious?: number; // seconds
  driveDistanceFromPrevious?: number; // meters
  cumulativeTime?: number; // seconds (drive + service cumulative)
}

export interface OptimizedRoute {
  stops: RouteStop[];
  totalDriveTime: number; // seconds
  totalDriveDistance: number; // meters
  totalServiceTime: number; // seconds
  totalRouteTime: number; // seconds
  geometry?: string; // encoded polyline
  legs?: RouteLeg[];
}

export interface RouteLeg {
  driveTime: number; // seconds
  driveDistance: number; // meters
  geometry?: string;
}

export interface CapacitySettings {
  dayOfWeek: number;
  maxHours: number | null;
  maxClients: number | null;
}

export interface DayFitResult {
  day: string;
  dayOfWeek: number;
  marginalDriveTime: number; // seconds added
  insertAfterStop: number; // index
  nearestStopDistance: number; // meters
  currentStops: number;
  maxStops: number | null;
  currentHours: number;
  maxHours: number | null;
  atCapacity: boolean;
  recommendation: "best" | "good" | "warning" | "full";
}

export interface RerouteSuggestion {
  clientId: string;
  clientName: string;
  currentDay: string;
  suggestedDay: string;
  currentDaySavings: number; // seconds saved on current day
  suggestedDayCost: number; // seconds added to suggested day
  netSavings: number; // seconds
  reason: string;
}
