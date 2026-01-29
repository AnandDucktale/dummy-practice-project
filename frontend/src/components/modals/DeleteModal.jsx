import React from 'react';
import { IoClose } from 'react-icons/io5';

const DeleteModal = ({
  onClose,
  handleModalConfirm,
  handleModalCancel,
  modalPurpose,
}) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div onClick={onClose} className="absolute inset-0 bg-black/50"></div>
        <div className="relative bg-white w-full max-w-md shadow-lg py-10 px-8  flex flex-col items-center gap-8 rounded-lg">
          {/* <div
            onClick={onClose}
            className="absolute -top-5 -right-5 bg-fuchsia-50 hover:bg-fuchsia-100 transition-all p-2 rounded-full cursor-pointer"
          >
            <IoClose className="w-6 h-6" />
          </div> */}
          <p className="text-xl text-fuchsia-950 font-semibold">
            {modalPurpose}
          </p>
          <div className="flex items-center justify-around w-full gap-4">
            <button
              onClick={handleModalConfirm}
              className="bg-red-400 border-2 border-red-400 text-white  py-2 px-8 rounded-md
                        hover:border-red-600 
                        hover:bg-red-600  cursor-pointer transition-all"
            >
              Confirm
            </button>
            <button
              onClick={handleModalCancel}
              className="border-2 border-green-400 text-green-400
                        hover:text-green-600
                        hover:border-green-600 py-2 px-8 rounded-md cursor-pointer"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
