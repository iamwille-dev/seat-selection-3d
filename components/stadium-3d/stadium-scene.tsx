"use client";

import { Canvas } from "@react-three/fiber";
import { useVenueStore } from "@/lib/store";
import { SectionMesh } from "./section-mesh";
import { CameraController } from "./camera-controller";
import { Stage } from "./stage";
import { Ground } from "./ground";

export function StadiumScene() {
  const computedVenue = useVenueStore((s) => s.computedVenue);

  return (
    <Canvas
      shadows
      camera={{ fov: 50, near: 0.1, far: 200 }}
      style={{ background: "#0f0f1a" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 30, 10]} intensity={1} castShadow />
      <pointLight position={[0, 15, 0]} intensity={0.5} />

      <CameraController />
      <Ground />
      <Stage />

      {computedVenue.sections.map((section) => (
        <SectionMesh key={section.config.id} section={section} />
      ))}
    </Canvas>
  );
}
