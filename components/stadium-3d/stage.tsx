"use client";

import { useVenueStore } from "@/lib/store";
import { VenueConfig } from "@/lib/venue/types";

function CircleStage({ config }: { config: VenueConfig }) {
  return (
    <group>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[config.stageRadius * 0.7, 64]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[config.stageRadius * 0.68, config.stageRadius * 0.72, 64]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}

function RectStage({ config }: { config: VenueConfig }) {
  const hw = config.stageWidth / 2;
  const hl = config.stageLength / 2;
  return (
    <group>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[config.stageWidth, config.stageLength]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Border lines */}
      {[
        [[-hw, 0.06, -hl], [hw * 2, 0.06, 0.06]],
        [[-hw, 0.06, hl], [hw * 2, 0.06, 0.06]],
        [[-hw, 0.06, 0], [0.06, 0.06, hl * 2]],
        [[hw, 0.06, 0], [0.06, 0.06, hl * 2]],
      ].map(([pos, size], i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={size as [number, number, number]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      ))}
    </group>
  );
}

function BasketballCourt({ config }: { config: VenueConfig }) {
  const hw = config.stageWidth / 2;
  const hl = config.stageLength / 2;
  const lineW = 0.06;
  const lineY = 0.07;

  return (
    <group>
      {/* Court floor */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[config.stageWidth, config.stageLength]} />
        <meshStandardMaterial color="#c68642" />
      </mesh>

      {/* Boundary lines */}
      {[
        { pos: [0, lineY, -hl], scale: [config.stageWidth, lineW, lineW] },
        { pos: [0, lineY, hl], scale: [config.stageWidth, lineW, lineW] },
        { pos: [-hw, lineY, 0], scale: [lineW, lineW, config.stageLength] },
        { pos: [hw, lineY, 0], scale: [lineW, lineW, config.stageLength] },
        // Half-court line
        { pos: [0, lineY, 0], scale: [config.stageWidth, lineW, lineW] },
      ].map(({ pos, scale }, i) => (
        <mesh key={`line-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={scale as [number, number, number]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Center circle */}
      <mesh position={[0, lineY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.8, 48]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Free throw lanes (paint) */}
      {[-1, 1].map((side) => {
        const zCenter = side * (hl - 2.8);
        const laneW = 3.6;
        const laneL = 5.6;
        return (
          <group key={`paint-${side}`}>
            {/* Paint area */}
            <mesh position={[0, 0.06, zCenter]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[laneW, laneL]} />
              <meshStandardMaterial color="#a0522d" />
            </mesh>
            {/* Lane border */}
            <mesh position={[0, lineY, zCenter]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[laneW / 2 - lineW, laneW / 2, 4]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0} />
            </mesh>
            {/* Lane lines */}
            {[
              { pos: [-laneW / 2, lineY, zCenter], scale: [lineW, lineW, laneL] },
              { pos: [laneW / 2, lineY, zCenter], scale: [lineW, lineW, laneL] },
              { pos: [0, lineY, zCenter - side * laneL / 2], scale: [laneW, lineW, lineW] },
            ].map(({ pos, scale }, i) => (
              <mesh key={`lane-${side}-${i}`} position={pos as [number, number, number]}>
                <boxGeometry args={scale as [number, number, number]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            ))}
            {/* Free throw circle */}
            <mesh
              position={[0, lineY, zCenter - side * laneL / 2]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[1.7, 1.8, 48]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* Three-point arc (simplified as ring segment) */}
            <mesh position={[0, lineY, side * hl]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[6.5, 6.6, 48, 1, side > 0 ? Math.PI * 0.18 : -Math.PI * 0.18, Math.PI * 0.64]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      })}

      {/* Backboards */}
      {[-1, 1].map((side) => (
        <mesh key={`bb-${side}`} position={[0, 1.8, side * (hl - 0.6)]}>
          <boxGeometry args={[1.8, 1.1, 0.05]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function HockeyRink({ config }: { config: VenueConfig }) {
  const hw = config.stageWidth / 2;
  const hl = config.stageLength / 2;
  const lineW = 0.06;
  const lineY = 0.07;

  return (
    <group>
      {/* Ice surface */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[config.stageWidth, config.stageLength]} />
        <meshStandardMaterial color="#e8f0fe" />
      </mesh>

      {/* Boundary */}
      {[
        { pos: [0, lineY, -hl], scale: [config.stageWidth, lineW, lineW] },
        { pos: [0, lineY, hl], scale: [config.stageWidth, lineW, lineW] },
        { pos: [-hw, lineY, 0], scale: [lineW, lineW, config.stageLength] },
        { pos: [hw, lineY, 0], scale: [lineW, lineW, config.stageLength] },
      ].map(({ pos, scale }, i) => (
        <mesh key={`border-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={scale as [number, number, number]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}

      {/* Red center line */}
      <mesh position={[0, lineY, 0]}>
        <boxGeometry args={[config.stageWidth, lineW, 0.12]} />
        <meshStandardMaterial color="#cc0000" />
      </mesh>

      {/* Blue lines */}
      {[-1, 1].map((side) => (
        <mesh key={`blue-${side}`} position={[0, lineY, side * hl * 0.35]}>
          <boxGeometry args={[config.stageWidth, lineW, 0.12]} />
          <meshStandardMaterial color="#0044cc" />
        </mesh>
      ))}

      {/* Center circle */}
      <mesh position={[0, lineY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 1.9, 48]} />
        <meshStandardMaterial color="#0044cc" />
      </mesh>

      {/* Face-off circles */}
      {[-1, 1].map((sideX) =>
        [-1, 1].map((sideZ) => (
          <mesh
            key={`fo-${sideX}-${sideZ}`}
            position={[sideX * hw * 0.55, lineY, sideZ * hl * 0.6]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[1.4, 1.5, 48]} />
            <meshStandardMaterial color="#cc0000" />
          </mesh>
        ))
      )}

      {/* Goal creases */}
      {[-1, 1].map((side) => (
        <mesh
          key={`crease-${side}`}
          position={[0, lineY, side * (hl - 1)]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[1.2, 32, 0, Math.PI]} />
          <meshStandardMaterial color="#aaccee" />
        </mesh>
      ))}

      {/* Boards (low walls) */}
      {[
        { pos: [0, 0.3, -hl - 0.15], scale: [config.stageWidth, 0.6, 0.15] },
        { pos: [0, 0.3, hl + 0.15], scale: [config.stageWidth, 0.6, 0.15] },
        { pos: [-hw - 0.15, 0.3, 0], scale: [0.15, 0.6, config.stageLength] },
        { pos: [hw + 0.15, 0.3, 0], scale: [0.15, 0.6, config.stageLength] },
      ].map(({ pos, scale }, i) => (
        <mesh key={`board-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={scale as [number, number, number]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export function Stage() {
  const config = useVenueStore((s) => s.venueConfig);

  switch (config.stageType) {
    case "basketball":
      return <BasketballCourt config={config} />;
    case "hockey":
      return <HockeyRink config={config} />;
    case "rectangle":
      return <RectStage config={config} />;
    default:
      return <CircleStage config={config} />;
  }
}
