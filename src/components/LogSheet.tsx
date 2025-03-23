import React, { useRef, useEffect } from "react";
import { format } from "date-fns";
import { Paper, Typography, Box } from "@mui/material";
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
      return "#ffffff";
    case "ON_DUTY":
      return "#ffeb3b";
    case "DRIVING":
      return "#4caf50";
    default:
      return "#ffffff";
  }
};

export const LogSheet: React.FC<LogSheetProps> = ({ logs, date }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
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

      ctx.fillStyle = getStatusColor(log.status);
      ctx.fillRect(startX, y, width, GRID_HEIGHT / 3);
      ctx.strokeRect(startX, y, width, GRID_HEIGHT / 3);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Set up styles
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.font = "12px Arial";

    // Draw grid and logs
    drawGrid(ctx);
    drawLogs(ctx);
  }, [logs, date]);

  return (
    <Paper elevation={3} sx={{ p: 3, my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Driver's Daily Log - {format(new Date(date), "MM/dd/yyyy")}
      </Typography>
      <Box sx={{ overflowX: "auto" }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{ width: "100%", maxWidth: CANVAS_WIDTH }}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Legend:
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "#ffffff",
                border: "1px solid black",
                mr: 1,
              }}
            />
            <Typography variant="body2">Off Duty</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "#ffeb3b",
                border: "1px solid black",
                mr: 1,
              }}
            />
            <Typography variant="body2">On Duty</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "#4caf50",
                border: "1px solid black",
                mr: 1,
              }}
            />
            <Typography variant="body2">Driving</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
