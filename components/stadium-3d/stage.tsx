"use client";

import { useVenueStore } from "@/lib/store";

export function Stage() {
  const stageRadius = useVenueStore((s) => s.venueConfig.stageRadius);

  return (
    <group>
      {/* Stage platform */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[stageRadius * 0.7, 64]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Stage rim */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[stageRadius * 0.68, stageRadius * 0.72, 64]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}
