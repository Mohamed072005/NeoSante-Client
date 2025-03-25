"use client"

import L from "leaflet"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import {useEffect, useState} from "react";

const DefaultIcon = L.icon({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface LocationPickerProps {
    latitude: number
    longitude: number
    onLocationChange: (lat: number, lng: number) => void
}

function MapEvents({onLocationChange,}: { onLocationChange: (lat: number, lng: number) => void
}) {useMapEvents({
        click(e) {
            onLocationChange(e.latlng.lat, e.latlng.lng)
        },
    })
    return null
}

export function LocationPicker({latitude, longitude, onLocationChange,}: LocationPickerProps) {
    const [mapReady, setMapReady] = useState<boolean>(false)

    useEffect(() => {
        setMapReady(true)
    }, [])

    if (!mapReady) {
        return (
            <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                <p>Loading map...</p>
            </div>
        )
    }

    return (
        <div className="h-64 w-full rounded-lg overflow-hidden border">
            <MapContainer
                center={[latitude || 0, longitude || 0]}
                zoom={latitude ? 15 : 2}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {latitude && longitude && (
                    <Marker position={[latitude, longitude]} />
                )}
                <MapEvents onLocationChange={onLocationChange} />
            </MapContainer>
        </div>
    )
}