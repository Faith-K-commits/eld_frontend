import React, { useRef, useEffect } from "react";
import { format } from "date-fns";
import { Paper, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { LogEntry } from "../types";

interface LogSheetProps {
  logs: LogEntry[];
  date: string;
}

const HOURS_IN_DAY = 24;
const GRID_HEIGHT = 100;
const GRID_START_Y = 50;

const getStatusColor = (status: LogEntry["status"]) => {
  switch (status) {
    case "OFF_DUTY":
      return "#e2e8f0";
    case "ON_DUTY":
      return "#fef08a";
    case "DRIVING":
      return "#86efac";
    default:
      return "#e2e8f0";
  }
};

const getStatusBorderColor = (status: LogEntry["status"]) => {
  switch (status) {
    case "OFF_DUTY":
      return "#94a3b8";
    case "ON_DUTY":
      return "#ca8a04";
    case "DRIVING":
      return "#16a34a";
    default:
      return "#94a3b8";
  }
};

export const LogSheet: React.FC<LogSheetProps> = ({ logs, date }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const drawGrid = (ctx: CanvasRenderingContext2D, canvasWidth: number) => {
    const hourWidth = canvasWidth / HOURS_IN_DAY;
    const fontSize = isMobile ? 10 : isTablet ? 11 : 12;
    const labelWidth = isMobile ? 60 : 70; // Match the label width from useEffect

    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = theme.palette.text.secondary;

    // Draw horizontal lines
    ctx.beginPath();
    for (let i = 0; i <= 3; i++) {
      const y = GRID_START_Y + (i * GRID_HEIGHT) / 3;
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
    }
    ctx.stroke();

    // Draw vertical lines and hour markers
    for (let hour = 0; hour <= HOURS_IN_DAY; hour++) {
      const x = hour * hourWidth;

      // Draw vertical line
      ctx.beginPath();
      ctx.moveTo(x, GRID_START_Y);
      ctx.lineTo(x, GRID_START_Y + GRID_HEIGHT);
      ctx.stroke();

      // Draw hour marker
      if (hour < HOURS_IN_DAY) {
        ctx.fillText(hour.toString().padStart(2, "0"), x + 2, GRID_START_Y - 5);
      }
    }

    // Draw status labels with adjusted font size and position
    ctx.textAlign = "right";
    ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
    ctx.fillText("OFF DUTY", -10, GRID_START_Y + GRID_HEIGHT / 6);
    ctx.fillText("ON DUTY", -10, GRID_START_Y + GRID_HEIGHT / 2);
    ctx.fillText("DRIVING", -10, GRID_START_Y + (5 * GRID_HEIGHT) / 6);
  };

  const drawLogs = (ctx: CanvasRenderingContext2D, canvasWidth: number) => {
    const hourWidth = canvasWidth / HOURS_IN_DAY;

    logs.forEach((log) => {
      const startTime = new Date(`${date}T${log.start_time}`);
      const endTime = new Date(`${date}T${log.end_time}`);

      const startHour = startTime.getHours() + startTime.getMinutes() / 60;
      const endHour = endTime.getHours() + endTime.getMinutes() / 60;

      const startX = startHour * hourWidth;
      const width = (endHour - startHour) * hourWidth;

      let y = GRID_START_Y;
      switch (log.status) {
        case "OFF_DUTY":
          y = GRID_START_Y;
          break;
        case "ON_DUTY":
          y = GRID_START_Y + GRID_HEIGHT / 3;
          break;
        case "DRIVING":
          y = GRID_START_Y + (2 * GRID_HEIGHT) / 3;
          break;
      }

      // Draw status block with rounded corners
      ctx.beginPath();
      const radius = 4;
      const height = GRID_HEIGHT / 3;

      ctx.moveTo(startX + radius, y);
      ctx.lineTo(startX + width - radius, y);
      ctx.quadraticCurveTo(startX + width, y, startX + width, y + radius);
      ctx.lineTo(startX + width, y + height - radius);
      ctx.quadraticCurveTo(
        startX + width,
        y + height,
        startX + width - radius,
        y + height
      );
      ctx.lineTo(startX + radius, y + height);
      ctx.quadraticCurveTo(startX, y + height, startX, y + height - radius);
      ctx.lineTo(startX, y + radius);
      ctx.quadraticCurveTo(startX, y, startX + radius, y);

      ctx.fillStyle = getStatusColor(log.status);
      ctx.fill();

      ctx.strokeStyle = getStatusBorderColor(log.status);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get container width
    const containerWidth = canvas.parentElement?.clientWidth || 800;
    const labelWidth = isMobile ? 60 : 70; // Adjust label width based on screen size
    const canvasWidth = Math.max(containerWidth - 40, 400); // Minimum width of 400px
    const canvasHeight = isMobile ? 180 : 200;

    // Set canvas scale for retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = (canvasWidth + labelWidth) * dpr; // Add label width to total canvas width
    canvas.height = canvasHeight * dpr;

    ctx.scale(dpr, dpr);
    canvas.style.width = `${canvasWidth + labelWidth}px`; // Add label width to canvas style width
    canvas.style.height = `${canvasHeight}px`;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth + labelWidth, canvasHeight);

    // Add padding for status labels
    ctx.translate(labelWidth, 0);

    drawGrid(ctx, canvasWidth);
    drawLogs(ctx, canvasWidth);
  }, [logs, date, theme.palette.text.secondary, isMobile, isTablet]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: isMobile ? 2 : 3,
        my: 2,
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: "rgba(148, 163, 184, 0.1)",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: theme.palette.text.primary,
          mb: 3,
          fontSize: isMobile ? "1.1rem" : "1.25rem",
        }}
      >
        Driver's Daily Log - {format(new Date(date), "MMMM d, yyyy")}
      </Typography>
      <Box sx={{ overflowX: "auto" }}>
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </Box>
      <Box
        sx={{
          mt: 3,
          pt: 2,
          borderTop: "1px solid",
          borderColor: "rgba(148, 163, 184, 0.1)",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: theme.palette.text.secondary,
            mb: 1,
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          }}
        >
          Legend:
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: isMobile ? 2 : 3,
            flexWrap: "wrap",
          }}
        >
          {[
            { status: "OFF_DUTY", label: "Off Duty" },
            { status: "ON_DUTY", label: "On Duty" },
            { status: "DRIVING", label: "Driving" },
          ].map(({ status, label }) => (
            <Box
              key={status}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: isMobile ? 16 : 20,
                  height: isMobile ? 16 : 20,
                  bgcolor: getStatusColor(status as LogEntry["status"]),
                  border: "1.5px solid",
                  borderColor: getStatusBorderColor(
                    status as LogEntry["status"]
                  ),
                  borderRadius: "4px",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};
