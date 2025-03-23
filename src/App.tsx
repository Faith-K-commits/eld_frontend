import { useState } from "react";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Alert,
  Paper,
  useMediaQuery,
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
      main: "#2563eb", // Modern blue
      light: "#60a5fa",
      dark: "#1d4ed8",
    },
    secondary: {
      main: "#059669", // Modern green
      light: "#34d399",
      dark: "#047857",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  typography: {
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.01562em",
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600,
      letterSpacing: "-0.00833em",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      letterSpacing: "0",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          borderRadius: "0.75rem",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingBottom: "2rem",
        },
      },
    },
  },
});

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripResponse, setTripResponse] = useState<TripResponse | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (tripDetails: TripDetails) => {
    try {
      setLoading(true);
      setError(null);
      const trip = await createTrip(tripDetails);
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
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f0f9ff 0%, #f8fafc 100%)",
          pt: 4,
          pb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                background: "linear-gradient(45deg, #2563eb 30%, #059669 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              TruckLog Pro
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: "600px", mx: "auto", px: 2 }}
            >
              Plan your routes efficiently while staying compliant with HOS
              regulations
            </Typography>
          </Box>

          <TripForm onSubmit={handleSubmit} isLoading={loading} />

          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                borderRadius: 2,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              {error}
            </Alert>
          )}

          {tripResponse && (
            <Box sx={{ mt: 6 }}>
              <Paper
                sx={{
                  p: isMobile ? 2 : 4,
                  mb: 4,
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Route Overview
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Distance
                    </Typography>
                    <Typography variant="h5">
                      {Math.round(tripResponse.route.distance_miles)} miles
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Estimated Duration
                    </Typography>
                    <Typography variant="h5">
                      {Math.round(tripResponse.route.duration_hours * 10) / 10}{" "}
                      hours
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Fuel Stops
                    </Typography>
                    <Typography variant="h5">
                      {tripResponse.route.fuel_stops.length}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <RouteMap route={tripResponse.route} />

              <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
                Daily Logs
              </Typography>
              {Object.entries(logsByDate).map(([date, logs]) => (
                <LogSheet key={date} date={date} logs={logs} />
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
