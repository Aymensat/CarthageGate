import React from 'react';
import { BsChatTextFill } from 'react-icons/bs'; // Using react-icons for a chat icon

const ChatbotPlaceholder: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="flex items-center justify-center p-4 rounded-full bg-blue-600 text-white shadow-lg 
                   hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 
                   focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        title="Open Chatbot"
      >
        <BsChatTextFill className="text-3xl" />
        <span className="ml-3 text-lg font-semibold hidden md:inline">Chat with AI</span>
      </button>
      {/* You can add a hidden chat window here that becomes visible on button click */}
    </div>
  );
};

export default ChatbotPlaceholder;
