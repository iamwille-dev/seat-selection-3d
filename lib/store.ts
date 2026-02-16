import { create } from "zustand";
import { VenueConfig, ComputedVenue } from "./venue/types";
import { computeVenue } from "./venue/geometry";
import { defaultVenueConfig } from "./venue/default-config";

interface VenueStore {
  venueConfig: VenueConfig;
  computedVenue: ComputedVenue;
  selectedSectionId: string | null;
  selectedSeatId: string | null;
  hoveredSeatId: string | null;
  setVenueConfig: (config: VenueConfig) => void;
  setSelectedSection: (id: string | null) => void;
  setSelectedSeat: (id: string | null) => void;
  setHoveredSeat: (id: string | null) => void;
}

export const useVenueStore = create<VenueStore>((set) => ({
  venueConfig: defaultVenueConfig,
  computedVenue: computeVenue(defaultVenueConfig),
  selectedSectionId: null,
  selectedSeatId: null,
  hoveredSeatId: null,
  setVenueConfig: (config) =>
    set({ venueConfig: config, computedVenue: computeVenue(config) }),
  setSelectedSection: (id) =>
    set({ selectedSectionId: id, selectedSeatId: null, hoveredSeatId: null }),
  setSelectedSeat: (id) => set({ selectedSeatId: id }),
  setHoveredSeat: (id) => set({ hoveredSeatId: id }),
}));
