import React, { useEffect, useState } from 'react';
import type { Alert } from '../services/emergencyService';
import { getAlertsByZone, AlertStatus } from '../services/emergencyService';

const EmergencyDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>('La Marsa'); // Default zone

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!selectedZone) return;

      setLoading(true);
      setError(null);
      try {
        const data = await getAlertsByZone(selectedZone, AlertStatus.PENDING);
        setAlerts(data);
      } catch (err) {
        console.error(`Failed to fetch alerts for ${selectedZone}:`, err);
        setError(`Failed to load alerts for ${selectedZone}.`);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [selectedZone]);

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.PENDING:
        return 'text-yellow-400';
      case AlertStatus.IN_PROGRESS:
        return 'text-blue-400';
      case AlertStatus.RESOLVED:
        return 'text-green-400';
      case AlertStatus.CANCELLED:
        return 'text-gray-500';
      default:
        return 'text-white';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex justify-center items-center h-48">
        <p className="text-red-400 text-lg">Loading emergency alerts...</p>
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
      <h2 className="text-2xl font-semibold text-red-400 mb-4">Emergency Alerts</h2>
      {alerts.length === 0 ? (
        <p className="text-gray-300">No pending alerts for zone: {selectedZone}.</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-3 bg-gray-700 rounded-md">
              <h3 className="text-xl font-bold text-white">{alert.type} - {alert.zone}</h3>
              <p className="text-sm">Description: {alert.description}</p>
              <p className={`text-sm font-bold ${getStatusColor(alert.status)}`}>
                Status: {alert.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyDashboard;
