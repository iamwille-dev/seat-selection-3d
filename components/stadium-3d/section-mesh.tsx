"use client";

import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useVenueStore } from "@/lib/store";
import { ComputedSection } from "@/lib/venue/types";

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

interface SectionMeshProps {
  section: ComputedSection;
}

export function SectionMesh({ section }: SectionMeshProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const selectedSeatId = useVenueStore((s) => s.selectedSeatId);
  const hoveredSeatId = useVenueStore((s) => s.hoveredSeatId);
  const setSelectedSeat = useVenueStore((s) => s.setSelectedSeat);
  const setHoveredSeat = useVenueStore((s) => s.setHoveredSeat);

  const seats = section.seats;
  const baseColor = section.config.color;

  // Build a seat ID -> instance index map
  const seatIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    seats.forEach((seat, i) => map.set(seat.id, i));
    return map;
  }, [seats]);

  // Set instance transforms
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    seats.forEach((seat, i) => {
      tempObject.position.set(...seat.position);
      tempObject.rotation.set(...seat.rotation);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  }, [seats]);

  // Update colors based on selection/hover
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    seats.forEach((seat, i) => {
      if (seat.id === selectedSeatId) {
        tempColor.set("#ffffff");
      } else if (seat.id === hoveredSeatId) {
        tempColor.set("#facc15");
      } else {
        tempColor.set(baseColor);
      }
      mesh.setColorAt(i, tempColor);
    });

    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [seats, selectedSeatId, hoveredSeatId, baseColor]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, seats.length]}
      onPointerOver={(e) => {
        e.stopPropagation();
        const instanceId = e.instanceId;
        if (instanceId !== undefined && seats[instanceId]) {
          setHoveredSeat(seats[instanceId].id);
        }
      }}
      onPointerOut={() => setHoveredSeat(null)}
      onClick={(e) => {
        e.stopPropagation();
        const instanceId = e.instanceId;
        if (instanceId !== undefined && seats[instanceId]) {
          setSelectedSeat(seats[instanceId].id);
        }
      }}
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}
