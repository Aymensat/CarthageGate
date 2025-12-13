import api from './api';

export enum AlertType {
  ALERT_TYPE_UNSPECIFIED = 'ALERT_TYPE_UNSPECIFIED',
  FIRE = 'FIRE',
  ACCIDENT = 'ACCIDENT',
  MEDICAL = 'MEDICAL',
  SECURITY = 'SECURITY',
  OTHER = 'OTHER',
}

export enum AlertStatus {
  ALERT_STATUS_UNSPECIFIED = 'ALERT_STATUS_UNSPECIFIED',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
}

export interface Alert {
  id: string;
  type: AlertType;
  zone: string;
  description: string;
  status: AlertStatus;
  latitude: number;
  longitude: number;
  created_at: {
    seconds: number;
    nanos: number;
  };
  updated_at: {
    seconds: number;
    nanos: number;
  };
  reporter_phone: string;
}

export const getAlertsByZone = async (zone: string, status?: AlertStatus): Promise<Alert[]> => {
  const params = status ? { status } : {};
  const response = await api.get<Alert[]>(`/emergency/alerts/zone/${zone}`, { params });
  return response.data;
};

export const createAlert = async (alertData: {
  type: AlertType;
  zone: string;
  description: string;
  latitude: number;
  longitude: number;
  reporter_phone: string;
}): Promise<any> => {
  const response = await api.post('/emergency/alerts', alertData);
  return response.data;
};

export const updateAlertStatus = async (alertId: string, new_status: AlertStatus): Promise<any> => {
  const response = await api.put(`/emergency/alerts/${alertId}/status`, { new_status });
  return response.data;
};
