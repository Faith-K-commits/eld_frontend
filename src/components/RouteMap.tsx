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
import { Paper, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const positions = route.geometry.coordinates.map(
    ([lon, lat]) => [lat, lon] as [number, number]
  );
  const bounds = positions.reduce(
    (bounds, pos) => bounds.extend(pos),
    L.latLngBounds(positions[0], positions[0])
  );

  const LocationInfo = ({ name, type }: { name: string; type: string }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {type === "fuel" ? (
        <LocalGasStationIcon sx={{ color: theme.palette.primary.main }} />
      ) : (
        <LocationOnIcon sx={{ color: theme.palette.primary.main }} />
      )}
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: type === "fuel" ? 400 : 500,
        }}
      >
        {name}
      </Typography>
    </Box>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: isMobile ? 2 : 3,
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: "rgba(148, 163, 184, 0.1)",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
    >
      <MapContainer
        bounds={bounds}
        style={{
          height: isMobile ? "400px" : "500px",
          width: "100%",
          borderRadius: "0.5rem",
        }}
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
          <Popup className="custom-popup">
            <LocationInfo name={`Start: ${route.from.name}`} type="location" />
          </Popup>
        </Marker>

        {/* Pickup Marker */}
        <Marker
          position={[route.pickup.coordinates[1], route.pickup.coordinates[0]]}
          icon={defaultIcon}
        >
          <Popup className="custom-popup">
            <LocationInfo
              name={`Pickup: ${route.pickup.name}`}
              type="location"
            />
          </Popup>
        </Marker>

        {/* Dropoff Marker */}
        <Marker
          position={[
            route.dropoff.coordinates[1],
            route.dropoff.coordinates[0],
          ]}
          icon={defaultIcon}
        >
          <Popup className="custom-popup">
            <LocationInfo
              name={`Dropoff: ${route.dropoff.name}`}
              type="location"
            />
          </Popup>
        </Marker>

        {/* Fuel Stop Markers */}
        {route.fuel_stops.map((stop, index) => (
          <Marker
            key={index}
            position={[stop.coordinates[1], stop.coordinates[0]]}
            icon={defaultIcon}
          >
            <Popup className="custom-popup">
              <Box sx={{ minWidth: "200px" }}>
                <LocationInfo name={`Fuel Stop ${index + 1}`} type="fuel" />
                <Box sx={{ mt: 1, ml: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    Distance: {Math.round(stop.distance_miles)} miles
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    Est. Time: {Math.round(stop.estimated_hours * 10) / 10}{" "}
                    hours
                  </Typography>
                </Box>
              </Box>
            </Popup>
          </Marker>
        ))}

        {/* Route Line */}
        <Polyline
          positions={positions}
          pathOptions={{
            color: theme.palette.primary.main,
            weight: 4,
            opacity: 0.7,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      </MapContainer>

      <style>
        {`
          .custom-popup .leaflet-popup-content-wrapper {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .custom-popup .leaflet-popup-tip {
            background: rgba(255, 255, 255, 0.95);
          }
          .custom-popup .leaflet-popup-content {
            margin: 8px 12px;
            line-height: 1.4;
          }
        `}
      </style>
    </Paper>
  );
};
