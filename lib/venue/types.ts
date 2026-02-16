export interface VenueConfig {
  name: string;
  sections: SectionConfig[];
  stageRadius: number;
  rowSpacing: number;
  seatSpacing: number;
}

export interface SectionConfig {
  id: string;
  label: string;
  startAngle: number;
  endAngle: number;
  rows: number;
  seatsPerRow: number;
  elevation: number;
  tilt: number;
  color: string;
}

export interface Seat {
  id: string;
  sectionId: string;
  row: number;
  number: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface ComputedSection {
  config: SectionConfig;
  seats: Seat[];
}

export interface ComputedVenue {
  config: VenueConfig;
  sections: ComputedSection[];
  allSeats: Map<string, Seat>;
}
