import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="p-4 text-center border-b border-gray-700 bg-gray-900 shadow-lg">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 tracking-wider">
        Smart City Operations Dashboard
      </h1>
      <p className="mt-2 text-lg text-gray-400">Your central hub for urban intelligence</p>
    </header>
  );
};

export default Header;
