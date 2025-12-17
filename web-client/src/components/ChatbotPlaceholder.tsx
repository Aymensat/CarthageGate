import React, { useState } from 'react';
import { BsChatTextFill } from 'react-icons/bs'; // Using react-icons for a chat icon
import Chatbot from './Chatbot'; // Import the new Chatbot component

const ChatbotPlaceholder: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    console.log("toggleChat called, new state will be:", !isChatOpen);
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="flex items-center justify-center p-4 rounded-full bg-blue-600 text-white shadow-lg 
                   hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 
                   focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        title="Open Chatbot"
        onClick={toggleChat}
      >
        <BsChatTextFill className="text-3xl" />
        <span className="ml-3 text-lg font-semibold hidden md:inline">Chat with AI</span>
      </button>

      {isChatOpen && <Chatbot onClose={toggleChat} />}
    </div>
  );
};

export default ChatbotPlaceholder;
