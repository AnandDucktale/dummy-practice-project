import React from 'react';

const Error = ({ refresh, error }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <p className="text-red-600 font-semibold">Error: {error}</p>
        <button
          onClick={refresh}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default Error;
