import React from 'react';
import Header from './components/Header';
import ChatbotPlaceholder from './components/ChatbotPlaceholder';
import MobilityDashboard from './features/MobilityDashboard';
import AirQualityDashboard from './features/AirQualityDashboard';
import EmergencyDashboard from './features/EmergencyDashboard';
import GraphQLDashboard from './features/GraphQLDashboard'; // Import GraphQLDashboard

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header />

      <main className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Mobility Service Widget */}
        <MobilityDashboard /> 

        {/* Air Quality Service Widget */}
        <AirQualityDashboard />

        {/* Emergency Service Widget */}
        <EmergencyDashboard />

        {/* GraphQL Service Widget */}
        <GraphQLDashboard />
      </main>

      <ChatbotPlaceholder />
    </div>
  );
};

export default App;
