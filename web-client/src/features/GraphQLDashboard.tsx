import React, { useEffect, useState } from 'react';
import type { CityStats, UpcomingEvent } from '../services/graphQLService';
import { getCityStats, getUpcomingEvents } from '../services/graphQLService';

const GraphQLDashboard: React.FC = () => {
  const [stats, setStats] = useState<CityStats | null>(null);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraphQLData = async () => {
      try {
        const [statsData, eventsData] = await Promise.all([
          getCityStats(),
          getUpcomingEvents(3), // Fetch top 3 upcoming events
        ]);
        setStats(statsData);
        setEvents(eventsData);
      } catch (err) {
        console.error("Failed to fetch GraphQL data:", err);
        setError("Failed to load city data.");
      } finally {
        setLoading(false);
      }
    };
    fetchGraphQLData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex justify-center items-center h-48">
        <p className="text-purple-400 text-lg">Loading city insights...</p>
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
      <h2 className="text-2xl font-semibold text-purple-400 mb-4">City Insights</h2>
      
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 p-3 rounded-md text-center">
            <p className="text-sm text-gray-300">Total POIs</p>
            <p className="text-2xl font-bold text-white">{stats.totalPOIs}</p>
          </div>
          <div className="bg-gray-700 p-3 rounded-md text-center">
            <p className="text-sm text-gray-300">Upcoming Events</p>
            <p className="text-2xl font-bold text-white">{stats.upcomingEventsCount}</p>
          </div>
          <div className="bg-gray-700 p-3 rounded-md text-center">
            <p className="text-sm text-gray-300">Total Zones</p>
            <p className="text-2xl font-bold text-white">{stats.totalZones}</p>
          </div>
          <div className="bg-gray-700 p-3 rounded-md text-center">
            <p className="text-sm text-gray-300">Avg. Rating</p>
            <p className="text-2xl font-bold text-white">{stats.averageRating.toFixed(1)}</p>
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold text-purple-300 mb-2">Upcoming Events</h3>
      {events.length > 0 ? (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="p-2 bg-gray-700 rounded-md text-sm">
              <p className="font-bold text-white">{event.title}</p>
              <p className="text-gray-400">{event.zone.name} - {new Date(event.startDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No upcoming events found.</p>
      )}
    </div>
  );
};

export default GraphQLDashboard;
