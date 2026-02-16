"use client";

import { useVenueStore } from "@/lib/store";
import { ComputedSection } from "@/lib/venue/types";

interface SectionDetailProps {
  section: ComputedSection;
}

export function SectionDetail({ section }: SectionDetailProps) {
  const selectedSeatId = useVenueStore((s) => s.selectedSeatId);
  const hoveredSeatId = useVenueStore((s) => s.hoveredSeatId);
  const setSelectedSeat = useVenueStore((s) => s.setSelectedSeat);
  const setHoveredSeat = useVenueStore((s) => s.setHoveredSeat);
  const setSelectedSection = useVenueStore((s) => s.setSelectedSection);

  const { config } = section;

  // Group seats by row
  const rows: (typeof section.seats)[] = [];
  for (let r = 0; r < config.rows; r++) {
    rows.push(
      section.seats.filter((s) => s.row === r)
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Section header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
        <button
          onClick={() => setSelectedSection(null)}
          className="flex items-center justify-center w-7 h-7 rounded-md bg-white/10 text-white/70 hover:bg-white/20 transition-colors text-sm"
          aria-label="Back to sections"
        >
          &larr;
        </button>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ backgroundColor: config.color }}
          />
          <h2 className="text-sm font-semibold text-white/90">
            {config.label}
          </h2>
          <span className="text-xs text-white/40">
            {config.rows} rows &middot; {config.seatsPerRow} per row
          </span>
        </div>
      </div>

      {/* Seat grid */}
      <div className="flex-1 overflow-auto p-4">
        {/* Stage indicator */}
        <div className="text-center mb-3">
          <span className="inline-block px-6 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 uppercase tracking-widest">
            Stage
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {rows.map((rowSeats, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-1">
              {/* Row label */}
              <span className="w-7 shrink-0 text-right text-[10px] text-white/30 pr-1">
                R{rowIndex + 1}
              </span>
              {/* Seats */}
              <div
                className="flex-1 grid"
                style={{
                  gridTemplateColumns: `repeat(${config.seatsPerRow}, 1fr)`,
                  gap: 2,
                }}
              >
                {rowSeats.map((seat) => {
                  const isSelected = seat.id === selectedSeatId;
                  const isHovered = seat.id === hoveredSeatId;

                  return (
                    <button
                      key={seat.id}
                      className="relative aspect-square rounded-sm transition-all duration-150"
                      style={{
                        backgroundColor: isSelected
                          ? "#fff"
                          : isHovered
                          ? "#facc15"
                          : config.color + "40",
                        border: isSelected
                          ? "2px solid #facc15"
                          : isHovered
                          ? `2px solid ${config.color}`
                          : "1px solid " + config.color + "60",
                        transform: isHovered ? "scale(1.3)" : "scale(1)",
                        zIndex: isHovered ? 10 : 0,
                      }}
                      title={`Row ${seat.row + 1}, Seat ${seat.number + 1}`}
                      onMouseEnter={() => setHoveredSeat(seat.id)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      onClick={() => setSelectedSeat(seat.id)}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-black">
                          &#10003;
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Seat number labels */}
        <div className="flex items-center gap-1 mt-1">
          <span className="w-7 shrink-0" />
          <div
            className="flex-1 grid"
            style={{
              gridTemplateColumns: `repeat(${config.seatsPerRow}, 1fr)`,
              gap: 2,
            }}
          >
            {Array.from({ length: config.seatsPerRow }, (_, i) => (
              <span
                key={i}
                className="text-[7px] text-white/20 text-center"
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Seat info footer */}
      <div className="px-4 py-3 border-t border-white/10">
        {selectedSeatId && section.seats.find((s) => s.id === selectedSeatId) ? (
          <div className="text-sm text-white/80">
            <span className="text-white font-medium">{config.label}</span>
            {" "}&middot; Row{" "}
            {(section.seats.find((s) => s.id === selectedSeatId)?.row ?? 0) + 1}
            {" "}&middot; Seat{" "}
            {(section.seats.find((s) => s.id === selectedSeatId)?.number ?? 0) + 1}
          </div>
        ) : (
          <div className="text-xs text-white/40">Click a seat to select</div>
        )}
      </div>
    </div>
  );
}
