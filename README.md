# TruckLog Pro

A React-based frontend application for planning trips and generating Electronic Logging Device (ELD) logs. This application helps truck drivers plan their routes and automatically generates ELD logs based on Hours of Service (HOS) regulations.

## Features

- Input trip details including current location, pickup location, and dropoff location
- View route on an interactive map with markers for start, pickup, dropoff, and fuel stops
- Automatically generated ELD logs based on HOS regulations
- Visual representation of daily logs with status indicators
- Support for multiple day trips
- Real-time route calculation and distance estimation

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A running instance of the ELD Trip Planner backend

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Faith-K-commits/eld_frontend
   cd eld-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```
   Replace the URL with your backend API URL if different.

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technology Stack

- React with TypeScript
- Vite for build tooling
- Material-UI for components and styling
- Leaflet for maps
- Axios for API requests
- date-fns for date manipulation
- HTML Canvas for log visualization

## Hours of Service (HOS) Rules Implemented

The application follows these HOS regulations:

- 11-hour driving limit
- 14-hour on-duty limit
- 10-hour off-duty requirement
- 70-hour/8-day limit
- Required fuel stops every 1,000 miles
- 1-hour allocation for pickup and dropoff activities
