"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

const RouteMap = dynamic(() => import("../../../components/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
      <p className="text-gray-500" >Loading map...</p>
    </div>
  ),
});

interface Stop {
  clientId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  estimatedServiceMinutes: number;
  driveTimeFromPrevious?: number;
  cumulativeTime?: number;
}

interface RouteResult {
  stops: Stop[];
  totalDriveTime: number;
  totalDriveDistance: number;
  totalServiceTime: number;
  totalRouteTime: number;
}

interface RerouteSuggestion {
  clientId: string;
  clientName: string;
  currentDay: string;
  suggestedDay: string;
  currentDaySavings: number;
  suggestedDayCost: number;
  netSavings: number;
  reason: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const min = Math.round(seconds / 60);
  if (min < 60) return `${min} min`;
  const hrs = Math.floor(min / 60);
  const m = min % 60;
  return `${hrs}h ${m}m`;
}

function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  return `${miles.toFixed(1)} mi`;
}

export default function RouteOptimizerPage() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [stops, setStops] = useState<Stop[]>([]);
  const [currentRoute, setCurrentRoute] = useState<RouteResult | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState<RouteResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptimized, setShowOptimized] = useState(false);
  const [reroutes, setReroutes] = useState<RerouteSuggestion[]>([]);
  const [showReroutes, setShowReroutes] = useState(false);
  const [isLoadingReroutes, setIsLoadingReroutes] = useState(false);
  const [capacity, setCapacity] = useState<Record<string, { maxHours: number | null; maxClients: number | null }>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // New Customer Placement state
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientAddress, setNewClientAddress] = useState("");
  const [newClientFrequency, setNewClientFrequency] = useState("weekly");
  const [newClientDogCount, setNewClientDogCount] = useState(1);
  const [newClientYardSize, setNewClientYardSize] = useState("2,001–3,000 sqft");
  const [newClientServiceMin, setNewClientServiceMin] = useState(15);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{ display_name: string; lat: number; lng: number }>>([]);
  const [selectedAddress, setSelectedAddress] = useState<{ display_name: string; lat: number; lng: number } | null>(null);
  const [fitResults, setFitResults] = useState<Array<{
    day: string;
    dayOfWeek: number;
    marginalDriveTime: number;
    insertAfterStop: number;
    nearestStopDistance: number;
    currentStops: number;
    maxStops: number | null;
    currentHours: number;
    maxHours: number | null;
    atCapacity: boolean;
    recommendation: "best" | "good" | "warning" | "full";
  }> | null>(null);
  const [fitBestDay, setFitBestDay] = useState<string | null>(null);
  const [fitFrequencyNote, setFitFrequencyNote] = useState("");
  const [isAnalyzingFit, setIsAnalyzingFit] = useState(false);
  const [addressSearchTimeout, setAddressSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load clients for selected day
  const loadClients = useCallback(async () => {
    setIsLoading(true);
    setOptimizedRoute(null);
    setShowOptimized(false);

    try {
      const res = await fetch("/api/route-optimizer/sync", { method: "POST" });
      const data = await res.json();
      const dayClients = data.byDay?.[selectedDay] || [];

      const mapped: Stop[] = dayClients.map((c: Record<string, unknown>) => ({
        clientId: c.clientId as string,
        name: c.name as string,
        address: c.address as string,
        lat: c.lat as number,
        lng: c.lng as number,
        estimatedServiceMinutes: (c.estimatedServiceMinutes as number) || 15,
      }));

      setStops(mapped);

      // Calculate initial route
      if (mapped.length >= 2) {
        const optRes = await fetch("/api/route-optimizer/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stops: mapped, useValhalla: false }),
        });
        const optData = await optRes.json();
        setCurrentRoute(optData.current);
      } else {
        setCurrentRoute(null);
      }
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDay]);

  // Load capacity settings
  useEffect(() => {
    fetch("/api/route-optimizer/capacity")
      .then((r) => r.json())
      .then((data) => setCapacity(data.capacity || {}))
      .catch(console.error);
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleOptimize = async () => {
    if (stops.length < 2) return;
    setIsOptimizing(true);

    try {
      const res = await fetch("/api/route-optimizer/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stops, useValhalla: false }),
      });
      const data = await res.json();
      setCurrentRoute(data.current);
      setOptimizedRoute(data.optimized);
      setShowOptimized(true);
    } catch (err) {
      console.error("Optimization failed:", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSuggestReroutes = async () => {
    setIsLoadingReroutes(true);
    try {
      const res = await fetch("/api/route-optimizer/suggest-reroutes", {
        method: "POST",
      });
      const data = await res.json();
      setReroutes(data.suggestions || []);
      setShowReroutes(true);
    } catch (err) {
      console.error("Reroute analysis failed:", err);
    } finally {
      setIsLoadingReroutes(false);
    }
  };

  const handleApplyOptimized = () => {
    if (optimizedRoute) {
      setStops(optimizedRoute.stops);
      setCurrentRoute(optimizedRoute);
      setOptimizedRoute(null);
      setShowOptimized(false);
    }
  };

  const handleCapacityChange = async (field: "maxHours" | "maxClients", value: string) => {
    const dayIndex = DAYS.indexOf(selectedDay);
    const dayOfWeek = dayIndex === 6 ? 0 : dayIndex + 1; // Sunday=0
    const numValue = value === "" ? null : Number(value);
    const current = capacity[String(dayOfWeek)] || { maxHours: null, maxClients: null };
    const updated = { ...current, [field]: numValue };

    setCapacity((prev) => ({ ...prev, [String(dayOfWeek)]: updated }));

    try {
      await fetch("/api/route-optimizer/capacity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayOfWeek, ...updated }),
      });
    } catch (err) {
      console.error("Failed to save capacity:", err);
    }
  };

  // Address search with debounce
  const handleAddressInput = (value: string) => {
    setNewClientAddress(value);
    setSelectedAddress(null);
    setFitResults(null);

    if (addressSearchTimeout) clearTimeout(addressSearchTimeout);

    if (value.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearchingAddress(true);
      try {
        const res = await fetch(`/api/route-optimizer/geocode?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setAddressSuggestions(data.results || []);
      } catch {
        setAddressSuggestions([]);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 500);

    setAddressSearchTimeout(timeout);
  };

  const handleSelectAddress = (addr: { display_name: string; lat: number; lng: number }) => {
    setSelectedAddress(addr);
    setNewClientAddress(addr.display_name);
    setAddressSuggestions([]);
  };

  const handleFindBestFit = async () => {
    if (!selectedAddress) return;
    setIsAnalyzingFit(true);
    setFitResults(null);

    try {
      const res = await fetch("/api/route-optimizer/fit-new-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: selectedAddress.display_name,
          lat: selectedAddress.lat,
          lng: selectedAddress.lng,
          frequency: newClientFrequency,
          estimatedServiceMinutes: newClientServiceMin,
        }),
      });
      const data = await res.json();
      setFitResults(data.results || []);
      setFitBestDay(data.bestDay || null);
      setFitFrequencyNote(data.frequencyNote || "");
    } catch (err) {
      console.error("Fit analysis failed:", err);
    } finally {
      setIsAnalyzingFit(false);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newStops = [...stops];
    const dragged = newStops[draggedIndex];
    newStops.splice(draggedIndex, 1);
    newStops.splice(index, 0, dragged);
    setStops(newStops);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Active route for display
  const activeRoute = showOptimized ? optimizedRoute : currentRoute;
  const displayStops = showOptimized && optimizedRoute ? optimizedRoute.stops : stops;

  // Capacity calculations
  const dayIndex = DAYS.indexOf(selectedDay);
  const dayOfWeek = dayIndex === 6 ? 0 : dayIndex + 1;
  const dayCapacity = capacity[String(dayOfWeek)] || { maxHours: 8, maxClients: 25 };
  const currentHours = activeRoute ? activeRoute.totalRouteTime / 3600 : 0;
  const capacityStatus: "ok" | "warning" | "over" =
    dayCapacity.maxClients && stops.length > dayCapacity.maxClients
      ? "over"
      : dayCapacity.maxHours && currentHours > dayCapacity.maxHours
        ? "over"
        : dayCapacity.maxClients && stops.length > dayCapacity.maxClients * 0.9
          ? "warning"
          : dayCapacity.maxHours && currentHours > dayCapacity.maxHours * 0.9
            ? "warning"
            : "ok";

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Route Optimizer</h1>
            <p className="text-gray-400 text-sm mt-1">
              Optimize your daily routes for maximum efficiency
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowNewClient(true); setFitResults(null); setSelectedAddress(null); setNewClientAddress(""); }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-gray-900 rounded-lg text-sm font-medium transition-colors"
            >
              📍 New Client Fit
            </button>
            <button
              onClick={handleSuggestReroutes}
              disabled={isLoadingReroutes}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-300 disabled:opacity-50"
            >
              {isLoadingReroutes ? "Analyzing..." : "💡 Suggest Reroutes"}
            </button>
            <button
              onClick={handleOptimize}
              disabled={stops.length < 2 || isOptimizing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-gray-900 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOptimizing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Optimizing...
                </span>
              ) : (
                "⚡ Optimize Route"
              )}
            </button>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex gap-1 mt-4">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDay === day
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 hover:text-gray-900 hover:bg-white"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      {activeRoute && (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Stops:</span>
              <span className={`font-semibold text-sm ${capacityStatus === "over" ? "text-red-400" : capacityStatus === "warning" ? "text-yellow-400" : "text-gray-900"}`}>
                {displayStops.length}
                {dayCapacity.maxClients && `/${dayCapacity.maxClients}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Drive:</span>
              <span className="text-gray-900 font-semibold text-sm">
                {formatTime(activeRoute.totalDriveTime)} ({formatDistance(activeRoute.totalDriveDistance)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Service:</span>
              <span className="text-gray-900 font-semibold text-sm">
                {formatTime(activeRoute.totalServiceTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Total:</span>
              <span className={`font-bold text-sm ${capacityStatus === "over" ? "text-red-400" : capacityStatus === "warning" ? "text-yellow-400" : "text-emerald-400"}`}>
                {formatTime(activeRoute.totalRouteTime)}
                {dayCapacity.maxHours && ` / ${dayCapacity.maxHours}h max`}
              </span>
            </div>

            {/* Comparison badge */}
            {showOptimized && currentRoute && optimizedRoute && (
              <div className="ml-auto bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
                <span className="text-emerald-400 text-sm font-semibold">
                  📊 {formatDistance(currentRoute.totalDriveDistance)} / {formatTime(currentRoute.totalDriveTime)}
                  {" → "}
                  {formatDistance(optimizedRoute.totalDriveDistance)} / {formatTime(optimizedRoute.totalDriveTime)}
                  {" "}
                  <span className="text-emerald-300">
                    (save {formatTime(currentRoute.totalDriveTime - optimizedRoute.totalDriveTime)})
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Capacity Settings (collapsible) */}
      <div className="bg-gray-50/50 border-b border-gray-200 px-6 py-2">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500" >Capacity:</span>
          <div className="flex items-center gap-2">
            <label className="text-gray-500" >Max hours:</label>
            <input
              type="number"
              value={dayCapacity.maxHours ?? ""}
              onChange={(e) => handleCapacityChange("maxHours", e.target.value)}
              placeholder="∞"
              className="w-16 px-2 py-1 bg-white border border-gray-300 rounded text-gray-900 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-500" >Max clients:</label>
            <input
              type="number"
              value={dayCapacity.maxClients ?? ""}
              onChange={(e) => handleCapacityChange("maxClients", e.target.value)}
              placeholder="∞"
              className="w-16 px-2 py-1 bg-white border border-gray-300 rounded text-gray-900 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Stop List Panel */}
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 font-semibold">
                {selectedDay} Stops ({displayStops.length})
              </h2>
              {showOptimized && (
                <button
                  onClick={handleApplyOptimized}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-gray-900 text-xs rounded-lg font-medium"
                >
                  Apply Order
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin w-8 h-8 text-emerald-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : displayStops.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">No stops for {selectedDay}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {displayStops.map((stop, index) => (
                  <div
                    key={stop.clientId}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white border border-gray-200 rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing border transition-colors ${
                      draggedIndex === index
                        ? "border-emerald-500 opacity-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold flex-shrink-0 ${
                        capacityStatus === "over" ? "bg-red-500" : capacityStatus === "warning" ? "bg-yellow-500" : "bg-emerald-500"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-sm font-medium truncate">
                          {stop.name}
                        </p>
                        <p className="text-gray-400 text-xs truncate mt-0.5">
                          {stop.address}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-gray-400 text-xs">
                            🕐 {stop.estimatedServiceMinutes}m service
                          </span>
                          {stop.driveTimeFromPrevious !== undefined && stop.driveTimeFromPrevious > 0 && (
                            <span className="text-blue-400 text-xs">
                              🚗 {formatTime(stop.driveTimeFromPrevious)} drive
                            </span>
                          )}
                          {stop.cumulativeTime !== undefined && (
                            <span className="text-gray-400 text-xs">
                              Σ {formatTime(stop.cumulativeTime)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-300 cursor-grab">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {displayStops.length > 0 ? (
            <RouteMap
              stops={displayStops}
              capacityStatus={capacityStatus}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 text-lg">No stops for {selectedDay}</p>
                <p className="text-gray-400 text-sm mt-1">
                  Select a day with scheduled clients
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reroute Suggestions Modal */}
      {showReroutes && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white border border-gray-300 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-gray-900 text-xl font-bold">💡 Reroute Suggestions</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Clients that would fit better on a different day
                </p>
              </div>
              <button
                onClick={() => setShowReroutes(false)}
                className="text-gray-400 hover:text-gray-900 p-2"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {reroutes.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Your routes look well-optimized! No significant improvements found.
                </p>
              ) : (
                <div className="space-y-4">
                  {reroutes.map((suggestion, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-4 border border-gray-300"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-900 font-semibold">
                            {suggestion.clientName}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {suggestion.currentDay} → {suggestion.suggestedDay}
                          </p>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                          <span className="text-emerald-400 text-sm font-semibold">
                            Save {formatTime(suggestion.netSavings)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        {suggestion.reason}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>
                          -{formatTime(suggestion.currentDaySavings)} on{" "}
                          {suggestion.currentDay}
                        </span>
                        <span>
                          +{formatTime(suggestion.suggestedDayCost)} on{" "}
                          {suggestion.suggestedDay}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* New Client Placement Panel */}
      {showNewClient && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white border border-gray-300 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-gray-900 text-xl font-bold">📍 New Customer — Route Fit Finder</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Find the best service day for a new client address
                </p>
              </div>
              <button
                onClick={() => setShowNewClient(false)}
                className="text-gray-400 hover:text-gray-900 p-2"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
              {/* Address Input */}
              <div className="relative">
                <label className="text-gray-400 text-sm block mb-1.5">Address</label>
                <input
                  type="text"
                  value={newClientAddress}
                  onChange={(e) => handleAddressInput(e.target.value)}
                  placeholder="Start typing an address..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
                {isSearchingAddress && (
                  <div className="absolute right-3 top-9">
                    <svg className="animate-spin w-4 h-4 text-gray-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                )}
                {addressSuggestions.length > 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {addressSuggestions.map((addr, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectAddress(addr)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors border-b border-gray-200/50 last:border-0"
                      >
                        {addr.display_name}
                      </button>
                    ))}
                  </div>
                )}
                {selectedAddress && (
                  <p className="text-emerald-400 text-xs mt-1">
                    ✓ Coordinates: {selectedAddress.lat.toFixed(4)}, {selectedAddress.lng.toFixed(4)}
                  </p>
                )}
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1.5">Frequency</label>
                  <select
                    value={newClientFrequency}
                    onChange={(e) => setNewClientFrequency(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="twice-a-week">Twice a Week</option>
                    <option value="monthly">Once a Month</option>
                    <option value="one-time">One-Time</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1.5">Dog Count</label>
                  <select
                    value={newClientDogCount}
                    onChange={(e) => setNewClientDogCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? "dog" : "dogs"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1.5">Yard Size</label>
                  <select
                    value={newClientYardSize}
                    onChange={(e) => setNewClientYardSize(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm"
                  >
                    <option value="1–1,000 sqft">1–1,000 sqft</option>
                    <option value="1,001–2,000 sqft">1,001–2,000 sqft</option>
                    <option value="2,001–3,000 sqft">2,001–3,000 sqft</option>
                    <option value="3,001–4,000 sqft">3,001–4,000 sqft</option>
                    <option value="4,001–5,000 sqft">4,001–5,000 sqft</option>
                    <option value="5,001–6,000 sqft">5,001–6,000 sqft</option>
                    <option value="6,001–7,000 sqft">6,001–7,000 sqft</option>
                    <option value="7,001–8,000 sqft">7,001–8,000 sqft</option>
                    <option value="8,001–9,000 sqft">8,001–9,000 sqft</option>
                    <option value="9,001–10,000 sqft">9,001–10,000 sqft</option>
                    <option value="10,001+ sqft">10,001+ sqft</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1.5">Est. Service Time</label>
                  <select
                    value={newClientServiceMin}
                    onChange={(e) => setNewClientServiceMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm"
                  >
                    <option value={10}>10 min</option>
                    <option value={15}>15 min</option>
                    <option value={20}>20 min</option>
                    <option value={25}>25 min</option>
                    <option value={30}>30 min</option>
                  </select>
                </div>
              </div>

              {/* Find Best Fit Button */}
              <button
                onClick={handleFindBestFit}
                disabled={!selectedAddress || isAnalyzingFit}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-gray-900 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzingFit ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing routes...
                  </span>
                ) : (
                  "🔍 Find Best Fit"
                )}
              </button>

              {/* Results */}
              {fitResults && (
                <div className="space-y-3">
                  <h3 className="text-gray-900 font-semibold text-sm">
                    Best Fit Analysis — {selectedAddress?.display_name?.split(",")[0]}
                  </h3>

                  {fitFrequencyNote && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2.5">
                      <p className="text-blue-400 text-sm">💡 {fitFrequencyNote}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    {fitResults.map((result) => (
                      <div
                        key={result.day}
                        className={`rounded-lg p-3 border transition-colors ${
                          result.recommendation === "best"
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : result.recommendation === "full"
                              ? "bg-red-500/5 border-red-500/20 opacity-60"
                              : result.recommendation === "warning"
                                ? "bg-yellow-500/5 border-yellow-500/20"
                                : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-900 font-semibold text-sm w-24">
                              {result.recommendation === "best" && "⭐ "}
                              {result.day}
                            </span>
                            <span className={`text-sm font-mono ${
                              result.recommendation === "best"
                                ? "text-emerald-400"
                                : result.recommendation === "full"
                                  ? "text-red-400"
                                  : "text-gray-300"
                            }`}>
                              +{Math.round(result.marginalDriveTime / 60)} min
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <span className={`${
                              result.atCapacity ? "text-red-400" : result.currentStops >= (result.maxStops || 25) * 0.9 ? "text-yellow-400" : "text-gray-500" 
                            }`}>
                              {result.currentStops}/{result.maxStops || "∞"} stops
                            </span>
                            <span className={`${
                              result.atCapacity ? "text-red-400" : "text-gray-500" 
                            }`}>
                              {result.currentHours}h/{result.maxHours || "∞"}h
                            </span>
                            {result.atCapacity && (
                              <span className="text-red-400 font-semibold">🔴 FULL</span>
                            )}
                            {result.recommendation === "warning" && (
                              <span className="text-yellow-400 font-semibold">⚠️ NEAR CAP</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                          <span>
                            Nearest stop: {(result.nearestStopDistance / 1609.34).toFixed(1)} mi away
                          </span>
                          <span>
                            Insert after stop #{result.insertAfterStop + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {fitBestDay && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 mt-3">
                      <p className="text-emerald-400 text-sm font-semibold">
                        ✅ Recommendation: Schedule on {fitBestDay}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Adds the least drive time while staying within capacity limits.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
