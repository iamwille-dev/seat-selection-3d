"use client";

import { VenueViewer } from "@/components/venue-viewer";
import { ConfigPanel } from "@/components/config-panel";

export default function Home() {
  return (
    <>
      <VenueViewer />
      <ConfigPanel />
    </>
  );
}
