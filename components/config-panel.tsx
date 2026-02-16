"use client";

import { useState } from "react";
import { useVenueStore } from "@/lib/store";
import { SectionConfig } from "@/lib/venue/types";
import { venuePresets } from "@/lib/venue/default-config";

const DEG = Math.PI / 180;
const toDeg = (rad: number) => Math.round((rad / DEG) * 10) / 10;
const toRad = (deg: number) => deg * DEG;

const PRESET_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

let nextId = 1;
function genId() {
  return `S${nextId++}`;
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block mb-1.5">
      <div className="flex justify-between text-[10px] text-white/50 mb-0.5">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 accent-blue-500"
      />
    </label>
  );
}

function SectionEditor({
  section,
  onUpdate,
  onRemove,
}: {
  section: SectionConfig;
  onUpdate: (s: SectionConfig) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const patch = (partial: Partial<SectionConfig>) =>
    onUpdate({ ...section, ...partial });

  const isArc = section.type === "arc";

  return (
    <div className="border border-white/10 rounded-md overflow-hidden">
      <button
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <span
          className="w-3 h-3 rounded-sm shrink-0"
          style={{ backgroundColor: section.color }}
        />
        <span className="text-xs font-medium text-white/90 flex-1 truncate">
          {section.label}
        </span>
        <span className="text-[9px] text-white/30 uppercase">
          {section.type === "arc" ? "arc" : "rect"}
        </span>
        <span className="text-[10px] text-white/30">
          {section.rows}&times;{section.seatsPerRow}
        </span>
        <span className="text-[10px] text-white/30">
          {expanded ? "\u25B2" : "\u25BC"}
        </span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-white/5 space-y-1.5">
          {/* Type selector */}
          <div className="flex gap-1">
            <button
              className={`flex-1 text-[10px] py-1 rounded transition-colors ${
                isArc
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
              onClick={() =>
                patch({ type: "arc", startAngle: 0, endAngle: toRad(90) })
              }
            >
              Arc
            </button>
            <button
              className={`flex-1 text-[10px] py-1 rounded transition-colors ${
                !isArc
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
              onClick={() =>
                patch({ type: "rectangular", x: 0, z: 0, facing: toRad(90) })
              }
            >
              Rectangular
            </button>
          </div>

          {/* Label & ID */}
          <div className="flex gap-2">
            <label className="flex-1 block">
              <span className="text-[10px] text-white/50">Label</span>
              <input
                type="text"
                value={section.label}
                onChange={(e) => patch({ label: e.target.value })}
                className="w-full mt-0.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white text-xs"
              />
            </label>
            <label className="w-14 block">
              <span className="text-[10px] text-white/50">ID</span>
              <input
                type="text"
                value={section.id}
                onChange={(e) => patch({ id: e.target.value })}
                className="w-full mt-0.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white text-xs"
              />
            </label>
          </div>

          {/* Color */}
          <div>
            <span className="text-[10px] text-white/50">Color</span>
            <div className="flex gap-1 mt-0.5 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  className="w-5 h-5 rounded-sm border-2 transition-colors"
                  style={{
                    backgroundColor: c,
                    borderColor: section.color === c ? "#fff" : "transparent",
                  }}
                  onClick={() => patch({ color: c })}
                />
              ))}
              <input
                type="color"
                value={section.color}
                onChange={(e) => patch({ color: e.target.value })}
                className="w-5 h-5 rounded-sm border-0 p-0 cursor-pointer bg-transparent"
              />
            </div>
          </div>

          {/* Type-specific fields */}
          {isArc ? (
            <div className="flex gap-2">
              <RangeField
                label="Start angle"
                value={toDeg(section.startAngle)}
                min={-180}
                max={360}
                step={5}
                onChange={(v) => patch({ startAngle: toRad(v) })}
              />
              <RangeField
                label="End angle"
                value={toDeg(section.endAngle)}
                min={-180}
                max={360}
                step={5}
                onChange={(v) => patch({ endAngle: toRad(v) })}
              />
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <RangeField
                  label="Position X"
                  value={section.x}
                  min={-30}
                  max={30}
                  step={0.5}
                  onChange={(v) => patch({ x: v })}
                />
                <RangeField
                  label="Position Z"
                  value={section.z}
                  min={-30}
                  max={30}
                  step={0.5}
                  onChange={(v) => patch({ z: v })}
                />
              </div>
              <RangeField
                label="Facing"
                value={toDeg(section.facing)}
                min={-180}
                max={360}
                step={5}
                onChange={(v) => patch({ facing: toRad(v) })}
              />
            </>
          )}

          {/* Rows & seats */}
          <div className="flex gap-2">
            <RangeField
              label="Rows"
              value={section.rows}
              min={1}
              max={20}
              step={1}
              onChange={(v) => patch({ rows: v })}
            />
            <RangeField
              label="Seats/row"
              value={section.seatsPerRow}
              min={1}
              max={50}
              step={1}
              onChange={(v) => patch({ seatsPerRow: v })}
            />
          </div>

          {/* Elevation & tilt */}
          <div className="flex gap-2">
            <RangeField
              label="Elevation"
              value={section.elevation}
              min={0}
              max={10}
              step={0.5}
              onChange={(v) => patch({ elevation: v })}
            />
            <RangeField
              label="Tilt"
              value={section.tilt}
              min={0}
              max={2}
              step={0.05}
              onChange={(v) => patch({ tilt: v })}
            />
          </div>

          <button
            onClick={onRemove}
            className="w-full mt-1 text-[10px] py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            Remove section
          </button>
        </div>
      )}
    </div>
  );
}

export function ConfigPanel() {
  const [open, setOpen] = useState(false);
  const venueConfig = useVenueStore((s) => s.venueConfig);
  const setVenueConfig = useVenueStore((s) => s.setVenueConfig);
  const setSelectedSection = useVenueStore((s) => s.setSelectedSection);

  function updateSection(index: number, section: SectionConfig) {
    const sections = [...venueConfig.sections];
    sections[index] = section;
    setVenueConfig({ ...venueConfig, sections });
  }

  function removeSection(index: number) {
    const sections = venueConfig.sections.filter((_, i) => i !== index);
    setVenueConfig({ ...venueConfig, sections });
  }

  function addSection(type: "arc" | "rectangular") {
    const id = genId();
    const base = {
      id,
      label: `Section ${id}`,
      rows: 5,
      seatsPerRow: 12,
      elevation: 0.5,
      tilt: 0.35,
      color: PRESET_COLORS[venueConfig.sections.length % PRESET_COLORS.length],
    };
    const newSection: SectionConfig =
      type === "arc"
        ? {
            ...base,
            type: "arc",
            startAngle: 0,
            endAngle: toRad(60),
            x: 0,
            z: 0,
            facing: 0,
          }
        : {
            ...base,
            type: "rectangular",
            startAngle: 0,
            endAngle: 0,
            x: 0,
            z: 0,
            facing: toRad(90),
          };
    setVenueConfig({
      ...venueConfig,
      sections: [...venueConfig.sections, newSection],
    });
  }

  function loadPreset(key: string) {
    setSelectedSection(null);
    setVenueConfig(venuePresets[key]);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 px-3 py-1.5 text-xs rounded bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
      >
        Configure
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-[#12122a] border-l border-white/10 text-white text-sm shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <span className="font-semibold text-xs uppercase tracking-wider text-white/60">
          Venue Config
        </span>
        <button
          onClick={() => setOpen(false)}
          className="text-white/40 hover:text-white/80 text-lg leading-none"
        >
          &times;
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Presets */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
            Presets
          </h3>
          <div className="flex gap-1">
            {Object.entries(venuePresets).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => loadPreset(key)}
                className={`flex-1 text-[10px] py-1.5 rounded transition-colors ${
                  venueConfig.name === preset.name
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Global settings */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
            General
          </h3>
          <label className="block">
            <span className="text-[10px] text-white/50">Venue Name</span>
            <input
              type="text"
              value={venueConfig.name}
              onChange={(e) =>
                setVenueConfig({ ...venueConfig, name: e.target.value })
              }
              className="w-full mt-0.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs"
            />
          </label>
          {/* Stage Type */}
          <div>
            <span className="text-[10px] text-white/50">Stage Type</span>
            <div className="flex gap-1 mt-0.5">
              {(
                [
                  ["circle", "Circle"],
                  ["rectangle", "Rectangle"],
                  ["basketball", "Basketball"],
                  ["hockey", "Hockey"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  className={`flex-1 text-[10px] py-1 rounded transition-colors ${
                    venueConfig.stageType === value
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-white/5 text-white/40 hover:bg-white/10"
                  }`}
                  onClick={() =>
                    setVenueConfig({ ...venueConfig, stageType: value })
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <RangeField
            label="Stage Radius"
            value={venueConfig.stageRadius}
            min={2}
            max={15}
            step={0.5}
            onChange={(v) =>
              setVenueConfig({ ...venueConfig, stageRadius: v })
            }
          />
          {venueConfig.stageType !== "circle" && (
            <div className="flex gap-2">
              <RangeField
                label="Stage Width"
                value={venueConfig.stageWidth}
                min={4}
                max={30}
                step={0.5}
                onChange={(v) =>
                  setVenueConfig({ ...venueConfig, stageWidth: v })
                }
              />
              <RangeField
                label="Stage Length"
                value={venueConfig.stageLength}
                min={4}
                max={40}
                step={0.5}
                onChange={(v) =>
                  setVenueConfig({ ...venueConfig, stageLength: v })
                }
              />
            </div>
          )}
          <RangeField
            label="Row Spacing"
            value={venueConfig.rowSpacing}
            min={0.8}
            max={3}
            step={0.1}
            onChange={(v) =>
              setVenueConfig({ ...venueConfig, rowSpacing: v })
            }
          />
          <RangeField
            label="Seat Spacing"
            value={venueConfig.seatSpacing}
            min={0.4}
            max={2}
            step={0.1}
            onChange={(v) =>
              setVenueConfig({ ...venueConfig, seatSpacing: v })
            }
          />
        </div>

        {/* Sections */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
              Sections ({venueConfig.sections.length})
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => addSection("arc")}
                className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
              >
                + Arc
              </button>
              <button
                onClick={() => addSection("rectangular")}
                className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
              >
                + Rect
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            {venueConfig.sections.map((section, i) => (
              <SectionEditor
                key={section.id}
                section={section}
                onUpdate={(s) => updateSection(i, s)}
                onRemove={() => removeSection(i)}
              />
            ))}
          </div>

          {venueConfig.sections.length === 0 && (
            <div className="text-xs text-white/30 text-center py-4">
              No sections. Add an arc or rectangular section.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
