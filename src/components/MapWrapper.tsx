"use client";

import dynamic from 'next/dynamic';
import { Column } from "@once-ui-system/core";
import { useMemo } from 'react';

const LeafletMap = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false, // This is crucial for Leaflet to work with Next.js
    loading: () => <Column fillWidth center style={{ height: "100%", background: "#f5f5f5" }}>Loading Map...</Column>
  }
);

export default function MapWrapper() {
  return <LeafletMap />;
}
