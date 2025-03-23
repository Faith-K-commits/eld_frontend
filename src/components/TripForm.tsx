import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { TripDetails } from "../types";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TimerIcon from "@mui/icons-material/Timer";

interface TripFormProps {
  onSubmit: (tripDetails: TripDetails) => Promise<void>;
  isLoading?: boolean;
}

export const TripForm: React.FC<TripFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState<TripDetails>({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_used: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "current_cycle_used" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tripDetails: TripDetails = {
        ...formData,
        current_cycle_used: Math.max(
          0,
          Math.min(70, formData.current_cycle_used)
        ),
      };
      await onSubmit(tripDetails);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: isMobile ? 3 : 4,
        maxWidth: 600,
        mx: "auto",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: "rgba(148, 163, 184, 0.1)",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ mb: 3, color: theme.palette.text.primary }}
      >
        Enter Trip Details
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          "& .MuiTextField-root": {
            mb: 3,
          },
        }}
      >
        <TextField
          fullWidth
          label="Current Location"
          name="current_location"
          value={formData.current_location}
          onChange={handleChange}
          required
          placeholder="Enter city, state (e.g., Chicago, IL)"
          helperText="Enter city and state, separated by comma"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        />
        <TextField
          fullWidth
          label="Pickup Location"
          name="pickup_location"
          value={formData.pickup_location}
          onChange={handleChange}
          required
          placeholder="Enter city, state (e.g., Milwaukee, WI)"
          helperText="Enter city and state, separated by comma"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        />
        <TextField
          fullWidth
          label="Dropoff Location"
          name="dropoff_location"
          value={formData.dropoff_location}
          onChange={handleChange}
          required
          placeholder="Enter city, state (e.g., Green Bay, WI)"
          helperText="Enter city and state, separated by comma"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        />
        <TextField
          fullWidth
          label="Current Cycle Used (Hours)"
          name="current_cycle_used"
          type="number"
          value={formData.current_cycle_used}
          onChange={handleChange}
          required
          inputProps={{ min: 0, max: 70, step: 0.5 }}
          helperText="Enter hours used in current 70-hour/8-day cycle (0-70)"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TimerIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={isLoading}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: "12px",
            textTransform: "none",
            fontSize: "1.1rem",
            fontWeight: 500,
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            "&:hover": {
              boxShadow:
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Generate Trip Logs"
          )}
        </Button>
      </Box>
    </Paper>
  );
};
