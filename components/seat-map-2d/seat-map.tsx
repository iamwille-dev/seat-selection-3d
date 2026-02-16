"use client";

import { useVenueStore } from "@/lib/store";
import { SectionArc } from "./section-arc";
import { SectionDetail } from "./section-detail";

const SVG_SIZE = 500;
const SCALE = 9;

export function SeatMap() {
  const computedVenue = useVenueStore((s) => s.computedVenue);
  const selectedSectionId = useVenueStore((s) => s.selectedSectionId);

  const cx = SVG_SIZE / 2;
  const cy = SVG_SIZE / 2;

  // If a section is selected, show the detail view
  const activeSection = selectedSectionId
    ? computedVenue.sections.find((s) => s.config.id === selectedSectionId)
    : null;

  if (activeSection) {
    return <SectionDetail section={activeSection} />;
  }

  // Section overview
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          Choose a Section
        </h2>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full h-full max-w-[500px] max-h-[500px]"
        >
          {/* Stage / court */}
          {computedVenue.config.stageType === "circle" ? (
            <circle
              cx={cx}
              cy={cy}
              r={computedVenue.config.stageRadius * SCALE * 0.7}
              fill="#1e293b"
              stroke="#475569"
              strokeWidth={1}
            />
          ) : (
            <rect
              x={cx - (computedVenue.config.stageWidth / 2) * SCALE}
              y={cy - (computedVenue.config.stageLength / 2) * SCALE}
              width={computedVenue.config.stageWidth * SCALE}
              height={computedVenue.config.stageLength * SCALE}
              rx={computedVenue.config.stageType === "hockey" ? 12 : 2}
              fill={
                computedVenue.config.stageType === "basketball"
                  ? "#8B5E3C"
                  : computedVenue.config.stageType === "hockey"
                  ? "#c8daf0"
                  : "#1e293b"
              }
              stroke="#475569"
              strokeWidth={1}
            />
          )}
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fill={computedVenue.config.stageType === "circle" ? "#94a3b8" : "#ffffff80"}
            fontSize={12}
            fontWeight="bold"
          >
            {computedVenue.config.stageType === "basketball"
              ? "COURT"
              : computedVenue.config.stageType === "hockey"
              ? "RINK"
              : computedVenue.config.stageType === "rectangle"
              ? "FIELD"
              : "STAGE"}
          </text>

          {computedVenue.sections.map((section) => (
            <SectionArc
              key={section.config.id}
              section={section}
              scale={SCALE}
              cx={cx}
              cy={cy}
              stageRadius={computedVenue.config.stageRadius}
              rowSpacing={computedVenue.config.rowSpacing}
              seatSpacing={computedVenue.config.seatSpacing}
            />
          ))}
        </svg>
      </div>

      <div className="px-4 py-3 border-t border-white/10">
        <div className="text-xs text-white/40">
          Click a section to browse seats
        </div>
      </div>
    </div>
  );
}
