"use client";

import dynamic from "next/dynamic";
import { SeatMap } from "./seat-map-2d/seat-map";
import { useVenueStore } from "@/lib/store";

const StadiumScene = dynamic(
  () => import("./stadium-3d/stadium-scene").then((m) => m.StadiumScene),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-white/40">Loading 3D...</div> }
);

export function VenueViewer() {
  const venueName = useVenueStore((s) => s.venueConfig.name);
  const selectedSectionId = useVenueStore((s) => s.selectedSectionId);
  const selectedSeatId = useVenueStore((s) => s.selectedSeatId);
  const setSelectedSection = useVenueStore((s) => s.setSelectedSection);

  const hasSelection = selectedSectionId || selectedSeatId;

  return (
    <div className="flex flex-col h-screen bg-[#0f0f1a] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 shrink-0">
        <h1 className="text-lg font-bold tracking-tight">{venueName}</h1>
        <div className="flex items-center gap-3">
          {hasSelection && (
            <button
              onClick={() => setSelectedSection(null)}
              className="text-xs px-3 py-1 rounded bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
            >
              Reset View
            </button>
          )}
          <span className="text-xs text-white/40">3D Seat Selection</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        {/* 2D Map */}
        <div className="w-full md:w-[380px] md:min-w-[320px] border-b md:border-b-0 md:border-r border-white/10 shrink-0 h-[40vh] md:h-auto">
          <SeatMap />
        </div>

        {/* 3D View */}
        <div className="flex-1 min-h-0">
          <StadiumScene />
        </div>
      </div>
    </div>
  );
}
