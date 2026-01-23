import { useState } from 'react';
import { IoIosPersonAdd } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

import defaultAvatar from '../../assets/defaultAvatar1.jpg';

const AddGroupMemberModal = ({
  copied,
  handleCopy,
  inviteLink,
  alreadyPresentUserIds,
  allUsers,
  onClose,
  onAddMembers,
}) => {
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) =>
      selectedUserIds.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleDone = () => {
    onAddMembers(selectedUserIds);
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
        <h1 className="text-3xl text-center">Add New Members</h1>

        {allUsers.length === alreadyPresentUserIds.length && (
          <div>All users already in this group</div>
        )}

        {allUsers.length !== alreadyPresentUserIds.length && (
          <ul className="inset-shadow-sm rounded-2xl overflow-y-auto max-h-64 hide-scrollbar bg-gray-50">
            {allUsers.map(
              (user) =>
                !alreadyPresentUserIds.includes(user._id) && (
                  <li
                    onClick={() => toggleUserSelection(user._id)}
                    key={user._id}
                    className={`flex items-center justify-between gap-4 p-4 transition-all cursor-pointer ${
                      selectedUserIds.includes(user._id)
                        ? 'bg-fuchsia-100'
                        : 'hover:bg-gray-200'
                    }`}
                    title="Tap for select or unselect"
                  >
                    {' '}
                    <div className="flex items-center gap-4">
                      <span>
                        <img
                          src={user.avatar || defaultAvatar}
                          alt="avatar"
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      </span>
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                    <button className="cursor-pointer">
                      <IoIosPersonAdd
                        className={`w-5 h-5 ${
                          selectedUserIds.includes(user._id)
                            ? 'text-fuchsia-600'
                            : 'text-gray-500'
                        }`}
                      />
                    </button>
                  </li>
                ),
            )}
          </ul>
        )}
        <p className="w-full text-center">or</p>
        {inviteLink && (
          <div className="inset-shadow-sm rounded-xl p-2 bg-gray-50 flex gap-4">
            <p className="truncate text-gray-600/80">{inviteLink}</p>
            <span onClick={handleCopy} className="cursor-pointer">
              {copied ? 'Copied' : 'Copy'}
            </span>
          </div>
        )}
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

export default AddGroupMemberModal;
