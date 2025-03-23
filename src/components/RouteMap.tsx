import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L, { Icon } from "leaflet";
import { RouteData } from "../types";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface RouteMapProps {
  route: RouteData;
}

export const RouteMap: React.FC<RouteMapProps> = ({ route }) => {
  const positions = route.geometry.coordinates.map(
    ([lon, lat]) => [lat, lon] as [number, number]
  );
  const bounds = positions.reduce(
    (bounds, pos) => bounds.extend(pos),
    L.latLngBounds(positions[0], positions[0])
  );

  return (
    <MapContainer
      bounds={bounds}
      style={{ height: "500px", width: "100%", marginTop: "20px" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Start Marker */}
      <Marker
        position={[route.from.coordinates[1], route.from.coordinates[0]]}
        icon={defaultIcon}
      >
        <Popup>Start: {route.from.name}</Popup>
      </Marker>

      {/* Pickup Marker */}
      <Marker
        position={[route.pickup.coordinates[1], route.pickup.coordinates[0]]}
        icon={defaultIcon}
      >
        <Popup>Pickup: {route.pickup.name}</Popup>
      </Marker>

      {/* Dropoff Marker */}
      <Marker
        position={[route.dropoff.coordinates[1], route.dropoff.coordinates[0]]}
        icon={defaultIcon}
      >
        <Popup>Dropoff: {route.dropoff.name}</Popup>
      </Marker>

      {/* Fuel Stop Markers */}
      {route.fuel_stops.map((stop, index) => (
        <Marker
          key={index}
          position={[stop.coordinates[1], stop.coordinates[0]]}
          icon={defaultIcon}
        >
          <Popup>
            Fuel Stop {index + 1}
            <br />
            Distance: {Math.round(stop.distance_miles)} miles
            <br />
            Est. Time: {Math.round(stop.estimated_hours * 10) / 10} hours
          </Popup>
        </Marker>
      ))}

      {/* Route Line */}
      <Polyline positions={positions} color="blue" weight={3} opacity={0.7} />
    </MapContainer>
  );
};
