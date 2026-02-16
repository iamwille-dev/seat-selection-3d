import { VenueConfig, SectionConfig, Seat, ComputedSection, ComputedVenue } from "./types";

// Round to 6 decimal places to avoid SSR/client floating-point serialization mismatches
const r6 = (n: number) => Math.round(n * 1e6) / 1e6;

function computeArcSection(section: SectionConfig, config: VenueConfig): ComputedSection {
  const seats: Seat[] = [];
  const arcSpan = section.endAngle - section.startAngle;

  for (let row = 0; row < section.rows; row++) {
    const radius = config.stageRadius + (row + 1) * config.rowSpacing;
    const y = r6(section.elevation + row * section.tilt);

    for (let seatNum = 0; seatNum < section.seatsPerRow; seatNum++) {
      const t = section.seatsPerRow > 1 ? seatNum / (section.seatsPerRow - 1) : 0.5;
      const angle = section.startAngle + t * arcSpan;

      const x = r6(radius * Math.cos(angle));
      const z = r6(radius * Math.sin(angle));

      // Rotation: face toward center (0, 0, 0)
      const rotY = r6(Math.atan2(x, z) + Math.PI);

      seats.push({
        id: `${section.id}-${row}-${seatNum}`,
        sectionId: section.id,
        row,
        number: seatNum,
        position: [x, y, z],
        rotation: [0, rotY, 0],
      });
    }
  }

  return { config: section, seats };
}

function computeRectangularSection(section: SectionConfig, config: VenueConfig): ComputedSection {
  const seats: Seat[] = [];
  const facing = section.facing;

  // Perpendicular direction (left-right across the section)
  const perpX = Math.cos(facing + Math.PI / 2);
  const perpZ = Math.sin(facing + Math.PI / 2);
  // Forward direction (away from stage, row depth)
  const fwdX = Math.cos(facing);
  const fwdZ = Math.sin(facing);

  for (let row = 0; row < section.rows; row++) {
    const y = r6(section.elevation + row * section.tilt);
    const rowOffset = (row + 1) * config.rowSpacing;

    for (let seatNum = 0; seatNum < section.seatsPerRow; seatNum++) {
      const seatOffset =
        (seatNum - (section.seatsPerRow - 1) / 2) * config.seatSpacing;

      const x = r6(section.x + fwdX * rowOffset + perpX * seatOffset);
      const z = r6(section.z + fwdZ * rowOffset + perpZ * seatOffset);

      // Face opposite to the forward direction (toward the stage)
      const rotY = r6(facing + Math.PI);

      seats.push({
        id: `${section.id}-${row}-${seatNum}`,
        sectionId: section.id,
        row,
        number: seatNum,
        position: [x, y, z],
        rotation: [0, rotY, 0],
      });
    }
  }

  return { config: section, seats };
}

function computeSection(section: SectionConfig, config: VenueConfig): ComputedSection {
  if (section.type === "rectangular") {
    return computeRectangularSection(section, config);
  }
  return computeArcSection(section, config);
}

export function computeVenue(config: VenueConfig): ComputedVenue {
  const sections = config.sections.map((s) => computeSection(s, config));
  const allSeats = new Map<string, Seat>();

  for (const section of sections) {
    for (const seat of section.seats) {
      allSeats.set(seat.id, seat);
    }
  }

  return { config, sections, allSeats };
}
