"use client";

import { useMemo, useState } from "react";
import { useVenueStore } from "@/lib/store";
import { ComputedSection } from "@/lib/venue/types";

interface SectionShapeProps {
  section: ComputedSection;
  scale: number;
  cx: number;
  cy: number;
  stageRadius: number;
  rowSpacing: number;
  seatSpacing: number;
}

function arcPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const ix1 = cx + innerR * Math.cos(startAngle);
  const iy1 = cy + innerR * Math.sin(startAngle);
  const ix2 = cx + innerR * Math.cos(endAngle);
  const iy2 = cy + innerR * Math.sin(endAngle);
  const ox1 = cx + outerR * Math.cos(startAngle);
  const oy1 = cy + outerR * Math.sin(startAngle);
  const ox2 = cx + outerR * Math.cos(endAngle);
  const oy2 = cy + outerR * Math.sin(endAngle);

  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${ox1} ${oy1}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${ox2} ${oy2}`,
    `L ${ix2} ${iy2}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1}`,
    `Z`,
  ].join(" ");
}

function rectPath(
  cx: number,
  cy: number,
  section: ComputedSection["config"],
  scale: number,
  rowSpacing: number,
  seatSpacing: number,
): { d: string; labelX: number; labelY: number } {
  const facing = section.facing;
  const perpX = Math.cos(facing + Math.PI / 2);
  const perpZ = Math.sin(facing + Math.PI / 2);
  const fwdX = Math.cos(facing);
  const fwdZ = Math.sin(facing);

  const halfWidth = ((section.seatsPerRow - 1) / 2) * seatSpacing + seatSpacing * 0.5;
  const innerDist = rowSpacing * 0.5;
  const outerDist = (section.rows + 0.5) * rowSpacing;

  // 4 corners of the rectangle in world space, mapped to SVG
  const corners = [
    [-halfWidth, innerDist],
    [halfWidth, innerDist],
    [halfWidth, outerDist],
    [-halfWidth, outerDist],
  ].map(([perp, fwd]) => {
    const wx = section.x + fwdX * fwd + perpX * perp;
    const wz = section.z + fwdZ * fwd + perpZ * perp;
    return `${cx + wx * scale},${cy + wz * scale}`;
  });

  const midFwd = (innerDist + outerDist) / 2;
  const labelWx = section.x + fwdX * midFwd;
  const labelWz = section.z + fwdZ * midFwd;

  return {
    d: `M ${corners.join(" L ")} Z`,
    labelX: cx + labelWx * scale,
    labelY: cy + labelWz * scale,
  };
}

export function SectionArc({
  section,
  scale,
  cx,
  cy,
  stageRadius,
  rowSpacing,
  seatSpacing,
}: SectionShapeProps) {
  const [hovered, setHovered] = useState(false);
  const setSelectedSection = useVenueStore((s) => s.setSelectedSection);
  const selectedSectionId = useVenueStore((s) => s.selectedSectionId);

  const { config } = section;
  const isActive = config.id === selectedSectionId;
  const seatCount = config.rows * config.seatsPerRow;

  const { d, labelX, labelY } = useMemo(() => {
    if (config.type === "rectangular") {
      return rectPath(cx, cy, config, scale, rowSpacing, seatSpacing);
    }

    // Arc
    const innerR = (stageRadius + rowSpacing) * scale;
    const outerR = (stageRadius + config.rows * rowSpacing + rowSpacing * 0.5) * scale;
    const d = arcPath(cx, cy, innerR, outerR, config.startAngle, config.endAngle);

    const midAngle = (config.startAngle + config.endAngle) / 2;
    const midR = (innerR + outerR) / 2;
    return {
      d,
      labelX: cx + midR * Math.cos(midAngle),
      labelY: cy + midR * Math.sin(midAngle),
    };
  }, [cx, cy, config, scale, stageRadius, rowSpacing, seatSpacing]);

  return (
    <g
      style={{ cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setSelectedSection(config.id)}
    >
      <path
        d={d}
        fill={isActive ? config.color : hovered ? config.color + "60" : config.color + "30"}
        stroke={hovered || isActive ? config.color : config.color + "80"}
        strokeWidth={isActive ? 2 : 1}
        style={{ transition: "fill 0.2s, stroke 0.2s" }}
      />
      <text
        x={labelX}
        y={labelY - 6}
        textAnchor="middle"
        dominantBaseline="central"
        fill={hovered || isActive ? "#fff" : config.color}
        fontSize={11}
        fontWeight="bold"
        style={{ pointerEvents: "none", transition: "fill 0.2s" }}
      >
        {config.label}
      </text>
      <text
        x={labelX}
        y={labelY + 8}
        textAnchor="middle"
        dominantBaseline="central"
        fill={hovered || isActive ? "#fff" : config.color + "99"}
        fontSize={8}
        style={{ pointerEvents: "none", transition: "fill 0.2s" }}
      >
        {seatCount} seats &middot; {config.rows} rows
      </text>
    </g>
  );
}
