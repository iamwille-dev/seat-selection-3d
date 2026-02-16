"use client";

import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useVenueStore } from "@/lib/store";
import { ComputedSection } from "@/lib/venue/types";

// Lowpoly model is ~1.4 x 1.9 x 1.7 units; scale to ~0.42 x 0.57 x 0.50
const SEAT_SCALE = 0.3;

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const qStandUp = new THREE.Quaternion().setFromAxisAngle(
  new THREE.Vector3(1, 0, 0),
  Math.PI / 2,
);
const qFace = new THREE.Quaternion();

interface SectionMeshProps {
  section: ComputedSection;
}

export function SectionMesh({ section }: SectionMeshProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const selectedSeatId = useVenueStore((s) => s.selectedSeatId);
  const hoveredSeatId = useVenueStore((s) => s.hoveredSeatId);
  const setSelectedSeat = useVenueStore((s) => s.setSelectedSeat);
  const setHoveredSeat = useVenueStore((s) => s.setHoveredSeat);

  const { scene } = useGLTF("/stadium_seat_lowpoly.glb");

  const seats = section.seats;
  const baseColor = section.config.color;

  // Extract geometry from the first mesh found in the GLB
  const geometry = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !geo) {
        geo = (child as THREE.Mesh).geometry;
      }
    });
    return geo!;
  }, [scene]);

  // Set instance transforms
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    seats.forEach((seat, i) => {
      tempObject.position.set(...seat.position);
      // Compose via quaternions: first stand model upright, then rotate to face stage
      qFace.setFromAxisAngle(new THREE.Vector3(0, 1, 0), seat.rotation[1]);
      tempObject.quaternion.multiplyQuaternions(qFace, qStandUp);
      tempObject.scale.setScalar(SEAT_SCALE);
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
      args={[geometry, undefined, seats.length]}
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
      <meshStandardMaterial roughness={0.6} metalness={0.1} />
    </instancedMesh>
  );
}

useGLTF.preload("/stadium_seat_lowpoly.glb");
