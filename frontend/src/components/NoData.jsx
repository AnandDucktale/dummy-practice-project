import React from 'react';

const NoData = ({ cause }) => {
  return (
    <div className="flex items-center justify-center bg-gray-300 px-20 py-10 rounded-md min-w-0 border">
      {cause}
    </div>
  );
};

export default NoData;
