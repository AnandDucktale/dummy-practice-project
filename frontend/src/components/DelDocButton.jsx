import React from 'react';
import { MdDeleteOutline } from 'react-icons/md';

const DelDocButton = ({ handleDeleteDocument }) => {
  return (
    <div className="fixed bottom-20 right-30 text-4xl ">
      <div
        onClick={handleDeleteDocument}
        className="text-white cursor-pointer p-4 bg-fuchsia-800 rounded-full w-16 h-16 flex items-center justify-center"
        title="Delete Document"
      >
        <MdDeleteOutline className="w-6 h-6" />
      </div>
    </div>
  );
};

export default DelDocButton;
