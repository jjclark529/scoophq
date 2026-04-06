"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Stop {
  clientId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  estimatedServiceMinutes: number;
}

interface RouteMapProps {
  stops: Stop[];
  routeGeometry?: [number, number][];
  center?: [number, number];
  zoom?: number;
  capacityStatus?: "ok" | "warning" | "over";
}

function createNumberedIcon(num: number, status: "ok" | "warning" | "over" = "ok") {
  const colors = {
    ok: { bg: "#10b981", border: "#059669" },
    warning: { bg: "#f59e0b", border: "#d97706" },
    over: { bg: "#ef4444", border: "#dc2626" },
  };
  const { bg, border } = colors[status];

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: ${bg};
      border: 2px solid ${border};
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">${num}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

export default function RouteMap({
  stops,
  routeGeometry,
  center,
  zoom = 12,
  capacityStatus = "ok",
}: RouteMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up existing map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const defaultCenter: [number, number] = center || [33.9533, -117.3962];
    const map = L.map(containerRef.current, {
      center: defaultCenter,
      zoom,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add markers
    const markers: L.Marker[] = [];
    stops.forEach((stop, index) => {
      const marker = L.marker([stop.lat, stop.lng], {
        icon: createNumberedIcon(index + 1, capacityStatus),
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: sans-serif;">
            <strong>#${index + 1}: ${stop.name}</strong><br/>
            <span style="color: #666; font-size: 12px;">${stop.address}</span><br/>
            <span style="color: #888; font-size: 11px;">~${stop.estimatedServiceMinutes} min service</span>
          </div>`
        );
      markers.push(marker);
    });

    // Draw route line
    if (routeGeometry && routeGeometry.length > 0) {
      const lineColor =
        capacityStatus === "over"
          ? "#ef4444"
          : capacityStatus === "warning"
            ? "#f59e0b"
            : "#10b981";

      L.polyline(routeGeometry, {
        color: lineColor,
        weight: 4,
        opacity: 0.8,
        dashArray: capacityStatus === "over" ? "10, 5" : undefined,
      }).addTo(map);
    } else if (stops.length >= 2) {
      // Draw straight lines between stops if no geometry
      const latlngs = stops.map((s) => [s.lat, s.lng] as [number, number]);
      L.polyline(latlngs, {
        color: "#10b981",
        weight: 3,
        opacity: 0.6,
        dashArray: "5, 10",
      }).addTo(map);
    }

    // Fit bounds to markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [stops, routeGeometry, center, zoom, capacityStatus]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ minHeight: 400 }}
    />
  );
}
