"use client";

import { useEffect, useRef, useState } from 'react';

// Declare custom elements to avoid TypeScript errors
// Declare custom elements to avoid TypeScript errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

const CONFIGURATION = {
  "locations": [
    {"title":"Suksan Massage","address1":"Weingartstrasse 57","address2":"3014 Bern, Switzerland","coords":{"lat":46.9619980723973,"lng":7.453313033729563},"placeId":"ChIJH8DCIO45jkcRpNPamNi-zJk"}
  ],
  "mapOptions": {"center":{"lat":46.9619980723973,"lng":7.453313033729563},"fullscreenControl":true,"mapTypeControl":false,"streetViewControl":false,"zoom":15,"zoomControl":true,"maxZoom":17,"mapId":""},
  "capabilities": {"input":true,"autocomplete":true,"directions":true,"distanceMatrix":true,"details":true,"actions":true}
};

export default function GoogleMapsLocator() {
  const [libLoaded, setLibLoaded] = useState(false);
  const locatorRef = useRef<any>(null);

  useEffect(() => {
    // Check if script is already present
    if (document.querySelector('script[src*="extended-component-library"]')) {
        setLibLoaded(true);
        return;
    }

    const script = document.createElement('script');
    script.src = "https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js";
    script.type = "module";
    script.async = true;
    script.onload = () => setLibLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (libLoaded && locatorRef.current) {
        customElements.whenDefined('gmpx-store-locator').then(() => {
             if (locatorRef.current.configureFromQuickBuilder) {
                locatorRef.current.configureFromQuickBuilder(CONFIGURATION);
             }
        });
    }
  }, [libLoaded]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
      return (
        <div style={{ padding: '20px', background: '#ffebee', color: '#c62828', borderRadius: '8px' }}>
          <strong>Google Maps Configuration Error:</strong><br/>
          Please add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your .env file.
        </div>
      );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <style jsx global>{`
        gmpx-store-locator {
          width: 100%;
          height: 100%;
          --gmpx-color-surface: #fff;
          --gmpx-color-on-surface: #212121;
          --gmpx-color-on-surface-variant: #757575;
          --gmpx-color-primary: #1967d2;
          --gmpx-color-outline: #e0e0e0;
          --gmpx-font-family-base: "Prompt", sans-serif;
          --gmpx-font-family-headings: "Playfair Display", serif;
          --gmpx-font-size-base: 0.875rem;
          --gmpx-hours-color-open: #188038;
          --gmpx-hours-color-closed: #d50000;
          --gmpx-rating-color: #ffb300;
          --gmpx-rating-color-empty: #e0e0e0;
        }
      `}</style>
      {/* @ts-ignore */}
      <gmpx-api-loader key={apiKey} solution-channel="GMP_QB_locatorplus_v11_cABD"></gmpx-api-loader>
      {/* @ts-ignore */}
      <gmpx-store-locator ref={locatorRef} map-id="DEMO_MAP_ID"></gmpx-store-locator>
    </div>
  );
}
