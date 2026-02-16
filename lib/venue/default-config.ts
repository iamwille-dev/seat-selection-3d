import { VenueConfig } from "./types";

const PI = Math.PI;

export const defaultVenueConfig: VenueConfig = {
  name: "Grand Arena",
  stageRadius: 8,
  rowSpacing: 1.4,
  seatSpacing: 0.8,
  sections: [
    {
      id: "A",
      label: "Section A",
      startAngle: -PI * 0.4,
      endAngle: PI * 0.4,
      rows: 8,
      seatsPerRow: 24,
      elevation: 0.5,
      tilt: 0.35,
      color: "#3b82f6", // blue
    },
    {
      id: "B",
      label: "Section B",
      startAngle: PI * 0.45,
      endAngle: PI * 0.95,
      rows: 8,
      seatsPerRow: 16,
      elevation: 0.5,
      tilt: 0.35,
      color: "#10b981", // green
    },
    {
      id: "C",
      label: "Section C",
      startAngle: PI * 1.0,
      endAngle: PI * 1.6,
      rows: 8,
      seatsPerRow: 24,
      elevation: 0.5,
      tilt: 0.35,
      color: "#f59e0b", // amber
    },
    {
      id: "D",
      label: "Section D",
      startAngle: PI * 1.65,
      endAngle: PI * 1.95,
      rows: 6,
      seatsPerRow: 10,
      elevation: 0.5,
      tilt: 0.35,
      color: "#ef4444", // red
    },
    // Upper tier
    {
      id: "U1",
      label: "Upper A",
      startAngle: -PI * 0.35,
      endAngle: PI * 0.35,
      rows: 5,
      seatsPerRow: 30,
      elevation: 4,
      tilt: 0.5,
      color: "#8b5cf6", // purple
    },
    {
      id: "U2",
      label: "Upper C",
      startAngle: PI * 1.05,
      endAngle: PI * 1.55,
      rows: 5,
      seatsPerRow: 30,
      elevation: 4,
      tilt: 0.5,
      color: "#ec4899", // pink
    },
  ],
};
