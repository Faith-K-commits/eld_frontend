import { useState } from "react";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { TripForm } from "./components/TripForm";
import { RouteMap } from "./components/RouteMap";
import { LogSheet } from "./components/LogSheet";
import { TripDetails, TripResponse } from "./types";
import { createTrip, generateTripLogs } from "./services/api";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripResponse, setTripResponse] = useState<TripResponse | null>(null);

  const handleSubmit = async (tripDetails: TripDetails) => {
    try {
      setLoading(true);
      setError(null);

      // First create the trip
      const trip = await createTrip(tripDetails);

      // Then generate the logs
      const response = await generateTripLogs(trip.id);

      setTripResponse(response);
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process trip. Please check your input and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Group logs by date
  const logsByDate =
    tripResponse?.logs.reduce((acc, log) => {
      if (!acc[log.date]) {
        acc[log.date] = [];
      }
      acc[log.date].push(log);
      return acc;
    }, {} as Record<string, typeof tripResponse.logs>) ?? {};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            ELD Trip Planner
          </Typography>

          <TripForm onSubmit={handleSubmit} isLoading={loading} />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {tripResponse && (
            <>
              <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                Route Overview
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" gutterBottom>
                  Total Distance:{" "}
                  {Math.round(tripResponse.route.distance_miles)} miles
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Estimated Duration:{" "}
                  {Math.round(tripResponse.route.duration_hours * 10) / 10}{" "}
                  hours
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Number of Fuel Stops: {tripResponse.route.fuel_stops.length}
                </Typography>
              </Box>

              <RouteMap route={tripResponse.route} />

              <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                Daily Logs
              </Typography>
              {Object.entries(logsByDate).map(([date, logs]) => (
                <LogSheet key={date} date={date} logs={logs} />
              ))}
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
