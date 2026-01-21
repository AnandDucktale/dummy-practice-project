import { IoClose } from 'react-icons/io5';
import defaultAvatar from '../../assets/defaultAvatar1.jpg';

const ViewGroupMemberModal = ({ groupMembers, onClose }) => {
  // console.log(groupMembers);

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
        <h1 className="text-3xl text-center">All Members</h1>
        <ul className="inset-shadow-sm rounded-2xl overflow-y-auto max-h-64 hide-scrollbar bg-gray-50">
          {groupMembers.length > 0 &&
            groupMembers.map((member) => (
              <li
                key={member._id}
                className="flex items-center gap-4 hover:bg-gray-200 p-4 transition-all"
              >
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
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewGroupMemberModal;
