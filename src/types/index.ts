export interface TripDetails {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_used: number;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface RoutePoint {
  name: string;
  coordinates: [number, number];
}

export interface FuelStop {
  coordinates: [number, number];
  distance_miles: number;
  estimated_hours: number;
}

export interface RouteData {
  from: RoutePoint;
  pickup: RoutePoint;
  dropoff: RoutePoint;
  distance_miles: number;
  duration_hours: number;
  geometry: {
    type: string;
    coordinates: [number, number][];
  };
  fuel_stops: FuelStop[];
}

export interface LogEntry {
  id: number;
  trip: number;
  date: string;
  start_time: string;
  end_time: string;
  status: 'OFF_DUTY' | 'ON_DUTY' | 'DRIVING';
  location: string;
  remarks?: string;
}

export interface Trip {
  id: number;
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_used: number;
  created_at: string;
  updated_at: string;
}

export interface TripResponse {
  id: number;
  trip: Trip;
  route: RouteData;
  logs: LogEntry[];
} 