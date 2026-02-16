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
          {/* Stage circle */}
          <circle
            cx={cx}
            cy={cy}
            r={computedVenue.config.stageRadius * SCALE * 0.7}
            fill="#1e293b"
            stroke="#475569"
            strokeWidth={1}
          />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#94a3b8"
            fontSize={14}
            fontWeight="bold"
          >
            STAGE
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
