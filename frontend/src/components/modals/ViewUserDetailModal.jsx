import React from 'react';
import { IoClose } from 'react-icons/io5';

const ViewUserDetailModal = ({
  setViewModalOpen,
  avatar,
  defaultAvatar,
  firstName,
  lastName,
  role,
  email,
}) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          onClick={() => setViewModalOpen(false)}
          className="absolute inset-0 bg-black/50"
        />

        <div className="relative bg-fuchsia-50 w-full max-w-md shadow-lg py-10 px-8 flex flex-col items-center gap-8 rounded-lg">
          <div
            onClick={() => setViewModalOpen(false)}
            className="absolute -top-5 -right-5 bg-fuchsia-50 hover:bg-fuchsia-100 transition-all p-2 rounded-full cursor-pointer"
          >
            <IoClose className="w-6 h-6" />
          </div>
          <img
            src={avatar || defaultAvatar}
            className="w-40 h-40 rounded-full object-cover shadow-2xl"
            alt="avatar"
          />
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <div className="flex items-center justify-between w-full max-w-xs">
              <span className="text-md text-fuchsia-950 font-semibold">
                NAME:
              </span>
              <span className="text-lg font-md">
                {firstName} {lastName}
              </span>
            </div>
            <div className="flex items-center justify-between w-full max-w-xs">
              <span className="text-md text-fuchsia-950 font-semibold">
                EMAIL:
              </span>
              <span className="text-center">{email}</span>
            </div>
            <div className="flex items-center justify-between w-full max-w-xs">
              <span className="text-md text-fuchsia-950 font-semibold">
                ROLE:
              </span>
              {role === 'admin' ? (
                <span className="text-red-500 text-xs font-semibold">
                  ADMIN
                </span>
              ) : (
                <span className="text-green-500 text-xs font-semibold text-center">
                  USER
                </span>
              )}
            </div>
          </div>
          {role === 'user' && (
            <button
              // onClick={makeAdmin}
              className="px-6 py-2 bg-fuchsia-600 text-fuchsia-50 rounded-md hover:bg-fuchsia-800 hover:text-white cursor-pointer transition-all"
            >
              Make Admin
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewUserDetailModal;
