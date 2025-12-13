import api from './api';

export interface AirQualityRecord {
  zoneName: string;
  aqi: number;
  no2: number;
  co2: number;
  o3: number;
  timestamp: string;
}

export interface AirQualityComparisonResult {
  record1: AirQualityRecord;
  record2: AirQualityRecord;
  verdict: string; // e.g., "Zone A has better air quality"
}

export const getAllAirQualityZones = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/air-quality/zones');
  // The API Gateway returns { records: [...] }, and it seems the gateway already extracts records.
  // However, the example response for GetAllZones suggests it returns an array of strings (zone names).
  // Let's assume for now it returns a direct array of zone names for simplicity in the frontend,
  // or it could be an array of objects if the `records` contain more than just names.
  // Re-checking the api-gateway code: `res.json(result[0].records);`. So `records` is an array.
  // I will assume `records` is an array of objects, and I need to extract zone names from them.
  // Or, if `result[0].records` directly returns strings, then `response.data` will be `string[]`.
  // For safety, let's assume it's an array of objects that have a `name` property.
  // If the API returns just strings, this will still work fine, as `map` will just return the string itself.

  // Let's adjust this after creating the component and seeing the actual data structure.
  // For now, assume it returns an array of simple objects with a 'zoneName' key, or just strings.
  if (response.data && response.data.length > 0 && typeof response.data[0] === 'object' && 'zoneName' in response.data[0]) {
    return response.data.map((zone: any) => zone.zoneName);
  }
  return response.data; // Assume it's already string[] if not object[]
};

export const getAirQualityByZone = async (zoneName: string): Promise<AirQualityRecord> => {
  const response = await api.get<AirQualityRecord>(`/air-quality/zones/${zoneName}`);
  return response.data;
};

export const compareAirQuality = async (zone1: string, zone2: string): Promise<AirQualityComparisonResult> => {
  const response = await api.post<AirQualityComparisonResult>('/air-quality/zones/compare', { zone1, zone2 });
  return response.data;
};
