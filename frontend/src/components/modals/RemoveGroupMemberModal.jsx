import { useState } from 'react';
import { HiUserRemove } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';

import defaultAvatar from '../../assets/defaultAvatar1.jpg';

const RemoveGroupMemberModal = ({ groupMembers, onClose, onRemoveMembers }) => {
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) =>
      selectedUserIds.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleDone = () => {
    onRemoveMembers(selectedUserIds);
    onClose();
  };
  return (
    <div className="fixed flex items-center justify-center inset-0 z-50">
      <div className="inset-0 absolute bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg inset-0 z-100 rounded-md shadow-xl/30 p-6 flex flex-col gap-4 ">
        <div
          onClick={onClose}
          className="absolute -top-5 -right-5 bg-fuchsia-50 hover:bg-fuchsia-100 transition-all p-2 rounded-full cursor-pointer"
        >
          <IoClose className="w-6 h-6" />
        </div>
        <h1 className="text-3xl text-center">Remove Members</h1>
        <ul className="inset-shadow-sm rounded-2xl overflow-y-auto max-h-64 hide-scrollbar bg-gray-50">
          {groupMembers.length > 0 &&
            groupMembers.map((member) => (
              <li
                key={member._id}
                onClick={() => toggleUserSelection(member.userId._id)}
                className={`flex items-center justify-between gap-4 0 p-4 transition-all ${
                  selectedUserIds.includes(member.userId._id)
                    ? 'bg-fuchsia-100'
                    : 'hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span>
                    <img
                      src={member.userId.avatar || defaultAvatar}
                      alt="avatar"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </span>
                  <span>
                    {member.userId.firstName} {member.userId.lastName}
                  </span>
                </div>
                <div className="text-gray-500">
                  <HiUserRemove />
                </div>
              </li>
            ))}
        </ul>
        <button
          onClick={handleDone}
          disabled={selectedUserIds.length === 0}
          className={`py-2 px-8 rounded-lg text-center w-fit self-center
    ${
      selectedUserIds.length === 0
        ? 'bg-fuchsia-300 text-white cursor-not-allowed'
        : 'bg-fuchsia-600 text-fuchsia-50 cursor-pointer'
    }
  `}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default RemoveGroupMemberModal;
