import React, { useEffect, useState } from 'react';
import { FaL, FaPeopleGroup } from 'react-icons/fa6';
import { MdDeleteOutline, MdGroupAdd } from 'react-icons/md';
import { MdGroupRemove } from 'react-icons/md';
import useAuthStore from '../hooks/store/useAuthStore';
import { LuCornerDownLeft } from 'react-icons/lu';

const GroupMenu = ({
  groupId,
  isMenuOpen,
  setMenuOpen,
  setViewGroupMemberModal,
  setAddGroupMemberModal,
  setRemoveGroupMemberModal,
  isSelectionOpen,
  setSelectionOpen,
  setSelectedDocsIds,
  leaveGroup,
}) => {
  const { user } = useAuthStore();

  return (
    <>
      {isMenuOpen && (
        <div className=" min-w-sm w-full bg-fuchsia-100/20 p-4 rounded-lg backdrop-blur-3xl shadow-2xl/30 flex flex-col divide-y divide-gray-300">
          <div
            title="Group Members"
            className="cursor-pointer flex items-center gap-2 bg-fuchsia-100/20 hover:bg-fuchsia-950/20 p-3 rounded-md"
            onClick={setViewGroupMemberModal}
          >
            <FaPeopleGroup className="w-10 h-10 p-3 bg-fuchsia-800 text-fuchsia-100 rounded-full" />
            <span>Group Members</span>
          </div>

          {user.role === 'admin' && (
            <div
              title="Add to group"
              className="cursor-pointer flex items-center gap-2 hover:bg-fuchsia-950/20 p-3 rounded-md"
              onClick={setAddGroupMemberModal}
            >
              <MdGroupAdd className="w-10 h-10 p-3 bg-fuchsia-800 text-fuchsia-100 rounded-full" />
              <span>Add Members</span>
            </div>
          )}

          {user.role === 'admin' && (
            <div
              title="Remove from group"
              className="cursor-pointer flex items-center gap-2 hover:bg-fuchsia-950/20 p-3 rounded-md"
              onClick={setRemoveGroupMemberModal}
            >
              <MdGroupRemove className="w-10 h-10 p-3 bg-fuchsia-800 text-fuchsia-100 rounded-full" />
              <span>Remove Members</span>
            </div>
          )}

          <div
            title="Remove Documents"
            className="cursor-pointer flex items-center gap-2 hover:bg-fuchsia-950/20 p-3 rounded-md"
            onClick={() => {
              if (isSelectionOpen) {
                setSelectionOpen(false);
                setSelectedDocsIds([]);
              } else {
                setSelectionOpen(true);
              }
              setMenuOpen(false);
            }}
          >
            <MdDeleteOutline className="w-10 h-10 p-3 bg-fuchsia-800 text-fuchsia-100 rounded-full" />
            <span>Remove Documents</span>
          </div>
          <div
            title="Leave Group"
            className="cursor-pointer flex items-center gap-2 hover:bg-fuchsia-950/20 p-3 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              leaveGroup(user._id, groupId);
            }}
          >
            <LuCornerDownLeft className="w-10 h-10 p-3 bg-fuchsia-800 text-fuchsia-100 rounded-full" />
            <span>Leave Group</span>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupMenu;
