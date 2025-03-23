import axios from 'axios';
import { TripDetails, TripResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const createTrip = async (tripDetails: TripDetails): Promise<TripResponse> => {
  try {
    const response = await api.post<TripResponse>('/trips/create/', tripDetails);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', error.response?.data);
      throw new Error(error.response?.data?.message || error.response?.data?.detail || 'Failed to create trip');
    }
    throw error;
  }
};

export const generateTripLogs = async (tripId: number): Promise<TripResponse> => {
  try {
    const response = await api.post<TripResponse>(`/trips/${tripId}/generate-logs/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', error.response?.data);
      throw new Error(error.response?.data?.message || error.response?.data?.detail || 'Failed to generate trip logs');
    }
    throw error;
  }
};

export const getTripDetails = async (tripId: number): Promise<TripResponse> => {
  try {
    const response = await api.get<TripResponse>(`/trips/${tripId}/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', error.response?.data);
      throw new Error(error.response?.data?.message || error.response?.data?.detail || 'Failed to get trip details');
    }
    throw error;
  }
}; 