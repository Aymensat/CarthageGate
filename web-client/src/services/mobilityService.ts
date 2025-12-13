import api from './api';

export interface TransportLine {
  id: string;
  name: string;
  type: 'BUS' | 'TRAIN' | 'METRO';
  status: 'GOOD' | 'DELAYED' | 'CANCELLED';
  description?: string;
}

export interface Schedule {
  id: string;
  lineId: string;
  departureTime: string; // e.g., "10:30"
  arrivalTime: string;   // e.g., "11:00"
  origin: string;
  destination: string;
}

export const getTransportLines = async (): Promise<TransportLine[]> => {
  const response = await api.get<TransportLine[]>('/mobility/lines');
  return response.data;
};

export const getSchedulesByLine = async (lineId: string): Promise<Schedule[]> => {
  const response = await api.get<Schedule[]>(`/mobility/schedules/line/${lineId}`);
  return response.data;
};

// Assuming an endpoint for general traffic status or specific line status
export const getTrafficStatus = async (): Promise<TransportLine[]> => {
  // This endpoint can be refined if a specific status endpoint is created.
  // For now, it refetches all lines, and the component can display their statuses.
  const response = await api.get<TransportLine[]>('/mobility/lines');
  return response.data;
};
