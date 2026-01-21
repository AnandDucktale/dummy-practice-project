import React from 'react';
import { IoClose } from 'react-icons/io5';

const AddNewContactModal = ({
  isOpen,
  onClose,
  onSave,
  setContactAge,
  setContactEmail,
  setContactName,
  setContactPhone,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={() => onClose()}
        className="absolute bg-black/50 inset-0"
      ></div>
      <form
        onSubmit={onSave}
        className=" relative bg-white rounded-lg shadow-lg p-12 w-full max-w-md flex flex-col items-center gap-4"
      >
        <div
          onClick={onClose}
          className="absolute -top-5 -right-5 bg-fuchsia-50 hover:bg-fuchsia-100 transition-all p-2 rounded-full cursor-pointer"
        >
          <IoClose className="w-6 h-6" />
        </div>
        <h2 className="text-4xl text-fuchsia-950">Add new contact</h2>
        <div className="w-full flex items-end justify-around gap-4">
          <label htmlFor="name" className="font-semibold">
            Name:
          </label>
          <input
            id="name"
            type="text"
            onChange={(e) => setContactName(e.target.value)}
            className="flex-1 px-4 py-2 border-b-2 border-b-gray-400 focus:border-b-fuchsia-600 focus:outline-none transition-all"
          />
        </div>
        <div className="w-full flex items-end justify-around gap-4">
          <label htmlFor="email" className="font-semibold">
            Email:
          </label>
          <input
            id="email"
            type="text"
            onChange={(e) => setContactEmail(e.target.value)}
            className="flex-1 px-4 py-2 border-b-2 border-b-gray-400 focus:border-b-fuchsia-600 focus:outline-none transition-all"
          />
        </div>
        <div className="w-full flex items-end justify-around gap-4">
          <label htmlFor="phone" className="font-semibold">
            Phone:
          </label>
          <input
            id="phone"
            type="text"
            onChange={(e) => setContactPhone(e.target.value)}
            className="flex-1 px-4 py-2 border-b-2 border-b-gray-400 focus:border-b-fuchsia-600 focus:outline-none transition-all"
          />
        </div>
        <div className="w-full flex items-end justify-around gap-4">
          <label htmlFor="age" className="font-semibold">
            Age:
          </label>
          <input
            id="age"
            type="number"
            onChange={(e) => setContactAge(e.target.value)}
            className="flex-1 px-4 py-2 border-b-2 border-b-gray-400 focus:border-b-fuchsia-600 focus:outline-none transition-all"
          />
        </div>
        <div className="w-full flex mt-4 gap-6">
          <button
            type="submit"
            className="w-full bg-fuchsia-600 text-fuchsia-50 p-2 rounded-md cursor-pointer hover:bg-fuchsia-800
                  hover:text-white transition-all"
          >
            Save
          </button>
          <button
            onClick={() => onClose()}
            className="w-full border-2 text-fuchsia-600 p-2 rounded-md cursor-pointer hover:border-fuchsia-800 
                  hover:text-fuchsia-800 
                  transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewContactModal;
