import React from 'react';

const PreLoader = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="mt-4 text-gray-700 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default PreLoader; 