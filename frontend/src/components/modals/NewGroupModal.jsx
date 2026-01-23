import { TiPencil } from 'react-icons/ti';
import { IoClose } from 'react-icons/io5';

import defaultGroupIcon from '../../assets/group-icon.png';

const NewGroupModal = ({
  onClose,
  imageRef,
  handleIcon,
  newGroupName,
  setNewGroupName,
  setNewGroupDescription,
  onCreateGroup,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-500">
      <div onClick={onClose} className="absolute inset-0 bg-black/50"></div>
      <div className="relative w-full max-w-3xl bg-gray-200 flex flex-col p-8 rounded-lg shadow-2xl/30 items-center gap-12">
        <div
          onClick={onClose}
          className="absolute -top-5 -right-5 bg-fuchsia-50 hover:bg-fuchsia-100 transition-all p-2 rounded-full cursor-pointer"
        >
          <IoClose className="w-6 h-6" />
        </div>
        <div className="w-full flex flex-col">
          <h1 className="text-fuchsia-900 text-4xl pb-6  mb-6">
            Fill details to create new group
          </h1>
          <div className="w-full flex">
            <div className="w-2/3">
              <div className="flex flex-col items-center justify-center rounded-full">
                <label
                  htmlFor="icon"
                  className=" group relative w-45 h-45 rounded-full overflow-hidden cursor-pointer hover:shadow-neutral-600 shadow-2xl transition-shadow"
                  title="Upload icon"
                >
                  <img
                    src={defaultGroupIcon}
                    ref={imageRef}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity "
                    title="Upload icon"
                  >
                    <span className="text-fuchsia-100 text-2xl">
                      <TiPencil title="Update profile pic" />
                    </span>
                  </div>
                </label>
                <input
                  type="file"
                  name="icon"
                  id="icon"
                  className="hidden"
                  onChange={(e) => handleIcon(e)}
                  accept="image/jpg, image/jpeg"
                />
              </div>
            </div>
            <div className="w-full border-l border-l-fuchsia-950/30 p-4 flex flex-col justify-between">
              <div className="flex flex-col">
                <label
                  htmlFor="groupName"
                  className="focus:text-fuchsia-600 px-4 font-bold text-fuchsia-800 border-l-fuchsia-800"
                >
                  Group name:
                </label>
                <input
                  type="text"
                  id="groupName"
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="p-2  focus:outline-none border-b-2 
              border-b-gray-500 focus:border-b-fuchsia-800"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="groupName"
                  className="focus:text-fuchsia-600 px-4 font-bold text-fuchsia-800 border-l-fuchsia-800 mt-4"
                >
                  Description:
                </label>

                <textarea
                  name="groupName"
                  id="groupName"
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="p-2  focus:outline-none border-b-2 
              border-b-gray-500 focus:border-b-fuchsia-800"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full text-center">
          <button
            disabled={newGroupName.trim() === ''}
            onClick={onCreateGroup}
            className="bg-fuchsia-600 text-white p-2 rounded-md max-w-sm w-full disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroupModal;
