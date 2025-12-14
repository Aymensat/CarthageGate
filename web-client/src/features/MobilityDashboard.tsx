import React, { useEffect, useState } from 'react';
import type { TransportLine } from '../services/mobilityService';
import { getTransportLines } from '../services/mobilityService';

const MobilityDashboard: React.FC = () => {
  const [transportLines, setTransportLines] = useState<TransportLine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransportLines = async () => {
      try {
        const data = await getTransportLines();
        setTransportLines(data);
      } catch (err) {
        console.error("Failed to fetch transport lines:", err);
        setError("Failed to load mobility data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransportLines();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex justify-center items-center h-48">
        <p className="text-blue-400 text-lg">Loading mobility data...</p>
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
      <h2 className="text-2xl font-semibold text-green-400 mb-4">Smart Mobility</h2>
      {transportLines.length === 0 ? (
        <p className="text-gray-300">No transport lines available.</p>
      ) : (
        <div className="space-y-4">
          {transportLines.map((line) => (
            <div key={line.id} className="p-3 bg-gray-700 rounded-md">
              <h3 className="text-xl font-bold text-white">{line.name} ({line.lineType})</h3>
              <p className={`text-sm ${line.lineStatus === 'GOOD' ? 'text-green-300' : line.lineStatus === 'DELAYED' ? 'text-yellow-300' : 'text-red-300'}`}>
                Status: {line.lineStatus}
              </p>
              {line.description && <p className="text-gray-400 text-sm mt-1">{line.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobilityDashboard;
