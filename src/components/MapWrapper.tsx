"use client";

import dynamic from 'next/dynamic';
import { Column } from "@once-ui-system/core";

const LeafletMap = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false, 
    loading: () => <Column fillWidth center style={{ height: "100%", background: "#f5f5f5" }}>Loading Map...</Column>
  }
);

const GoogleMapsLocator = dynamic(
  () => import('./GoogleMapsLocator'),
  { 
    ssr: false, 
    loading: () => <Column fillWidth center style={{ height: "100%", background: "#f5f5f5" }}>Loading Google Maps...</Column>
  }
);

export default function MapWrapper() {
  // Check if the Google Maps API key is configured
  const hasGoogleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.length > 0;

  if (hasGoogleMapsKey) {
    return <GoogleMapsLocator />;
  }

  return <LeafletMap />;
}
