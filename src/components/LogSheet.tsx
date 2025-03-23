import React, { useRef, useEffect } from "react";
import { format } from "date-fns";
import { Paper, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { LogEntry } from "../types";

interface LogSheetProps {
  logs: LogEntry[];
  date: string;
}

const HOURS_IN_DAY = 24;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 200;
const GRID_START_Y = 50;
const GRID_HEIGHT = 100;
const HOUR_WIDTH = CANVAS_WIDTH / HOURS_IN_DAY;

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

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.fillStyle = theme.palette.text.secondary;

    // Draw horizontal lines
    ctx.beginPath();
    for (let i = 0; i <= 3; i++) {
      const y = GRID_START_Y + (i * GRID_HEIGHT) / 3;
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
    }
    ctx.stroke();

    // Draw vertical lines and hour markers
    for (let hour = 0; hour <= HOURS_IN_DAY; hour++) {
      const x = hour * HOUR_WIDTH;

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

    // Draw status labels
    ctx.textAlign = "right";
    ctx.fillText("OFF DUTY", -5, GRID_START_Y + GRID_HEIGHT / 6);
    ctx.fillText("ON DUTY", -5, GRID_START_Y + GRID_HEIGHT / 2);
    ctx.fillText("DRIVING", -5, GRID_START_Y + (5 * GRID_HEIGHT) / 6);
  };

  const drawLogs = (ctx: CanvasRenderingContext2D) => {
    logs.forEach((log) => {
      const startTime = new Date(`${date}T${log.start_time}`);
      const endTime = new Date(`${date}T${log.end_time}`);

      const startHour = startTime.getHours() + startTime.getMinutes() / 60;
      const endHour = endTime.getHours() + endTime.getMinutes() / 60;

      const startX = startHour * HOUR_WIDTH;
      const width = (endHour - startHour) * HOUR_WIDTH;

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

    // Set canvas scale for retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Add 40px padding for status labels
    ctx.translate(40, 0);

    drawGrid(ctx);
    drawLogs(ctx);
  }, [logs, date, theme.palette.text.secondary]);

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
        sx={{ color: theme.palette.text.primary, mb: 3 }}
      >
        Driver's Daily Log - {format(new Date(date), "MMMM d, yyyy")}
      </Typography>
      <Box sx={{ overflowX: "auto" }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH + 40}
          height={CANVAS_HEIGHT}
          style={{
            width: "100%",
            maxWidth: CANVAS_WIDTH + 40,
            height: "auto",
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
          sx={{ color: theme.palette.text.secondary, mb: 1 }}
        >
          Legend:
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 3,
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
                  width: 20,
                  height: 20,
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
                sx={{ color: theme.palette.text.primary }}
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
