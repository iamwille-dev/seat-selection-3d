"use client";

import { useEffect, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import { useVenueStore } from "@/lib/store";

const OVERVIEW_POS: [number, number, number] = [0, 35, 25];
const OVERVIEW_TARGET: [number, number, number] = [0, 0, 0];

export function CameraController() {
  const controlsRef = useRef<CameraControls>(null!);
  const selectedSeatId = useVenueStore((s) => s.selectedSeatId);
  const selectedSectionId = useVenueStore((s) => s.selectedSectionId);
  const computedVenue = useVenueStore((s) => s.computedVenue);

  // Set initial overview position
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.setLookAt(...OVERVIEW_POS, ...OVERVIEW_TARGET, false);
  }, []);

  // Fly to selected seat
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (selectedSeatId) {
      const seat = computedVenue.allSeats.get(selectedSeatId);
      if (!seat) return;

      const [sx, sy, sz] = seat.position;
      const dist = Math.sqrt(sx * sx + sz * sz);
      const dirX = sx / dist;
      const dirZ = sz / dist;

      controls.setLookAt(
        sx + dirX * 3,
        sy + 2,
        sz + dirZ * 3,
        0, 0, 0,
        true
      );
      return;
    }

    if (selectedSectionId) {
      // Fly to section overview
      const section = computedVenue.sections.find(
        (s) => s.config.id === selectedSectionId
      );
      if (!section) return;

      const midAngle =
        (section.config.startAngle + section.config.endAngle) / 2;
      const midRadius =
        computedVenue.config.stageRadius +
        (section.config.rows / 2) * computedVenue.config.rowSpacing;

      const tx = midRadius * Math.cos(midAngle);
      const tz = midRadius * Math.sin(midAngle);
      const dist = Math.sqrt(tx * tx + tz * tz);
      const dirX = tx / dist;
      const dirZ = tz / dist;

      controls.setLookAt(
        tx + dirX * 12,
        section.config.elevation + 10,
        tz + dirZ * 12,
        tx, section.config.elevation, tz,
        true
      );
      return;
    }

    // Return to overview
    controls.setLookAt(...OVERVIEW_POS, ...OVERVIEW_TARGET, true);
  }, [selectedSeatId, selectedSectionId, computedVenue]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={3}
      maxDistance={60}
    />
  );
}
