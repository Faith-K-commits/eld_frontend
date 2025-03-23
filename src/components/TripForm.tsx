import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { TripDetails } from "../types";

interface TripFormProps {
  onSubmit: (tripDetails: TripDetails) => Promise<void>;
  isLoading?: boolean;
}

export const TripForm: React.FC<TripFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
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
      console.log("Submitting trip details:", tripDetails);
      await onSubmit(tripDetails);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Trip Details
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Current Location"
          name="current_location"
          value={formData.current_location}
          onChange={handleChange}
          margin="normal"
          required
          placeholder="Enter city, state (e.g., Chicago, IL)"
          helperText="Enter city and state, separated by comma"
        />
        <TextField
          fullWidth
          label="Pickup Location"
          name="pickup_location"
          value={formData.pickup_location}
          onChange={handleChange}
          margin="normal"
          required
          placeholder="Enter city, state (e.g., Milwaukee, WI)"
          helperText="Enter city and state, separated by comma"
        />
        <TextField
          fullWidth
          label="Dropoff Location"
          name="dropoff_location"
          value={formData.dropoff_location}
          onChange={handleChange}
          margin="normal"
          required
          placeholder="Enter city, state (e.g., Green Bay, WI)"
          helperText="Enter city and state, separated by comma"
        />
        <TextField
          fullWidth
          label="Current Cycle Used (Hours)"
          name="current_cycle_used"
          type="number"
          value={formData.current_cycle_used}
          onChange={handleChange}
          margin="normal"
          required
          inputProps={{ min: 0, max: 70, step: 0.5 }}
          helperText="Enter hours used in current 70-hour/8-day cycle (0-70)"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          disabled={isLoading}
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
