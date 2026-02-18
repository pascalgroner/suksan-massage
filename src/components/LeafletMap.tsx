"use client";

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js
const iconShadow = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';
const iconDefault = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetina = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
    iconUrl: iconDefault,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const shopIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const busIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const tramIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


export default function LeafletMap() {
    // Coordinates
    const shopCoords: [number, number] = [46.96211886042646, 7.453414954225922]; // Suksan Massage (Weingartstrasse 57)
    const breitfeldCoords: [number, number] = [46.962836434607226, 7.452942885459262]; // Breitfeld (Bus 20)
    const breitenreinCoords: [number, number] = [46.95904584959279, 7.454908646298835]; // Breitenrain (Tram 3,6,7,8,9)

    // Walking path (light dashed line)
    return (
        <MapContainer 
            center={[46.96069914151985, 7.45387510235355]} 
            zoom={16} 
            scrollWheelZoom={false} 
            style={{ height: "100%", width: "100%", borderRadius: "var(--radius-l)", zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            
            {/* Shop Marker */}
            <Marker position={shopCoords} icon={shopIcon}>
                <Popup>
                    <b>Suksan Massage</b><br />Weingartstrasse 57
                </Popup>
            </Marker>

            {/* Bus Marker */}
            <Marker position={breitfeldCoords} icon={busIcon}>
                <Popup>
                    <b>Breitfeld</b><br />Bus 20 (2 min laufen/walking)
                </Popup>
            </Marker>

            {/* Tram Marker */}
            <Marker position={breitenreinCoords} icon={tramIcon}>
                <Popup>
                    <b>Breitenrein</b><br />Tram 3, 6, 7, 8, 9 (4 min laufen/walking)
                </Popup>
            </Marker>

            {/* Walking Lines */}
            <Polyline 
                positions={[breitfeldCoords, shopCoords]} 
                pathOptions={{ color: 'gray', dashArray: '5, 10', weight: 4, opacity: 0.7 }} 
            />
             <Polyline 
                positions={[breitenreinCoords, shopCoords]} 
                pathOptions={{ color: 'gray', dashArray: '5, 10', weight: 4, opacity: 0.7 }} 
            />

        </MapContainer>
    );
}
