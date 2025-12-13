import React, { useEffect, useState } from 'react';
import type { AirQualityRecord } from '../services/airQualityService';
import { getAirQualityByZone, getAllAirQualityZones } from '../services/airQualityService';

const AirQualityDashboard: React.FC = () => {
  const [zones, setZones] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [airQuality, setAirQuality] = useState<AirQualityRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const fetchedZones = await getAllAirQualityZones();
        setZones(fetchedZones);
        if (fetchedZones.length > 0) {
          setSelectedZone(fetchedZones[0]); // Auto-select the first zone
        }
      } catch (err) {
        console.error("Failed to fetch air quality zones:", err);
        setError("Failed to load air quality zones.");
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, []);

  useEffect(() => {
    const fetchAirQuality = async () => {
      if (!selectedZone) return;

      setLoading(true);
      setError(null);
      try {
        const data = await getAirQualityByZone(selectedZone);
        setAirQuality(data);
      } catch (err) {
        console.error(`Failed to fetch air quality for ${selectedZone}:`, err);
        setError(`Failed to load air quality for ${selectedZone}.`);
      } finally {
        setLoading(false);
      }
    };
    fetchAirQuality();
  }, [selectedZone]);

  if (loading && zones.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex justify-center items-center h-48">
        <p className="text-yellow-400 text-lg">Loading air quality data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex justify-center items-center h-48">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Air Quality</h2>
      <div className="mb-4">
        <label htmlFor="zone-select" className="block text-gray-300 text-sm font-bold mb-2">
          Select Zone:
        </label>
        <select
          id="zone-select"
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
        >
          {zones.map((zone) => (
            <option key={zone} value={zone}>{zone}</option>
          ))}
        </select>
      </div>

      {airQuality && (
        <div className="bg-gray-700 p-3 rounded-md mt-4">
          <p className="text-lg text-white font-bold">{airQuality.zoneName}</p>
          <p className="text-sm text-gray-300">AQI: <span className="font-bold text-yellow-300">{airQuality.aqi}</span></p>
          <p className="text-sm text-gray-300">NO₂: {airQuality.no2} | CO₂: {airQuality.co2} | O₃: {airQuality.o3}</p>
          <p className="text-sm text-gray-400">Last updated: {new Date(airQuality.timestamp).toLocaleString()}</p>
        </div>
      )}
      {loading && selectedZone && <p className="text-blue-400 mt-4">Loading air quality for {selectedZone}...</p>}
      {!loading && !airQuality && selectedZone && <p className="text-gray-400 mt-4">No air quality data for {selectedZone}.</p>}
    </div>
  );
};

export default AirQualityDashboard;
