import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
import { AiOutlineMenuFold } from 'react-icons/ai';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { TiCancel } from 'react-icons/ti';

import useAuthStore from '../hooks/store/useAuthStore.jsx';
import AddGroupMemberModal from '../components/modals/AddGroupMemberModal';
import ViewGroupMemberModal from '../components/modals/ViewGroupMemberModal';
import GroupMenu from '../components/GroupMenu';
import RemoveGroupMemberModal from '../components/modals/RemoveGroupMemberModal';
import defaultGroupIcon from '../assets/group-icon.jpg';
import DeleteModal from '../components/modals/DeleteModal.jsx';
import DocsPreviewModal from '../components/modals/DocsPreviewModal.jsx';
import {
  joinGroupRoom,
  leaveGroupRoom,
  newDocNotificationHandler,
} from '../hooks/socket-events/groupEvents.jsx';
import { getSocket } from '../api/socket.js';
import LoadingSpin from '../components/LoadingSpin.jsx';
import DelDocButton from '../components/DelDocButton.jsx';
import GroupMessages from '../components/GroupMessages.jsx';
import useGroupChat from '../hooks/group-page/useGroupChat.jsx';
import useGroupDocument from '../hooks/group-page/useGroupDocument.jsx';
import useGroupMembers from '../hooks/group-page/useGroupMembers.jsx';

const GroupPage = () => {
  const menuRef = useRef(null);
  const loadMoreRef = useRef(false);

  const { groupId } = useParams();

  const navigate = useNavigate();

  const { user } = useAuthStore();

  // Groups state
  const [textMessage, setTextMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Modal
  const [viewGroupMemberModal, setViewGroupMemberModal] = useState(false);
  const [addGroupMemberModal, setAddGroupMemberModal] = useState(false);
  const [removeGroupMemberModal, setRemoveGroupMemberModal] = useState(false);
  const [isDocsPreviewModalOpen, setDocsPreviewModalOpen] = useState(false);
  const [isMenuModalOpen, setMenuModalOpen] = useState(false);
  const [isRemoveMemberModalOpen, setRemoveMemberModalOpen] = useState(false);
  const [isLeaveGroupModalOpen, setLeaveGroupModalOpen] = useState(false);

  // File selection
  const [isSelectionOpen, setSelectionOpen] = useState(false);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const {
    chatRef,
    isAddingPreviousMessage,
    initialLoading,
    loadNewMessages,
    error,
    hasMore,
    messages,
    groupName,
    groupIcon,
    inviteLink,
    fetchMessages,
    sendTextMessage,
    fetchGroupDetail,
    generateInviteLink,
    leaveGroup,
    newDocumentHandler,
    loadMoreMessages,
  } = useGroupChat(groupId);

  const {
    files,
    docError,
    docStatus,
    filePreviews,
    handleFileSelection,
    handleSelectionDoc,
    handleDocumentSubmission,
  } = useGroupDocument(groupId);

  const {
    groupMembers,
    allUsers,
    alreadyPresentUserIds,
    fetchGroupMembers,
    fetchAllUsers,
    onRemoveMembers,
    onAddMembers,
  } = useGroupMembers(groupId);

  useEffect(() => {
    if (initialLoading) return;
    loadMoreRef.current = true;
  }, [initialLoading]);

  useEffect(() => {
    if (!groupId) return;

    joinGroupRoom(groupId);
    getSocket().on('message:new', newDocumentHandler);
    getSocket().off('message:notification:new', newDocNotificationHandler);

    fetchMessages();
    fetchGroupDetail();
    generateInviteLink();
    fetchGroupMembers();

    if (user.role === 'admin') {
      fetchAllUsers();
    }
    return () => {
      getSocket().off('message:new', newDocumentHandler);
      getSocket().on('message:notification:new', newDocNotificationHandler);
      leaveGroupRoom(groupId);
    };
  }, [groupId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!chatRef.current) return;
    if (!messages.length) return;

    if (isAddingPreviousMessage.current) {
      isAddingPreviousMessage.current = false;
      return;
    }

    if (initialLoading) return;

    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, initialLoading]);

  useEffect(() => {
    if (!error && !docError && !docStatus) return;

    if (error || docError) {
      toast.error(error || docError, {
        position: 'top-center',
        autoClose: 3000,
        theme: 'colored',
      });
    }
    if (docStatus) {
      toast.success(docStatus, {
        position: 'top-center',
        autoClose: 3000,
        theme: 'colored',
      });
    }
  }, [error, docError, docStatus]);

  const handleChatUpperScroll = () => {
    const el = chatRef.current;
    if (!el || !hasMore) return;

    if (el.scrollTop <= 50 && loadMoreRef.current) {
      loadMoreMessages();
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveMemberConfirm = async () => {
    await onRemoveMembers(selectedUserIds);
    setRemoveMemberModalOpen(false);
    setSelectedUserIds([]);
  };

  const handleRemoveMemberCancel = () => {
    setRemoveMemberModalOpen(false);
    setSelectedUserIds([]);
  };

  const handleLeaveGroupConfirm = async () => {
    setMenuModalOpen(false);
    await leaveGroup(user._id);
    setLeaveGroupModalOpen(false);
  };

  const handleLeaveGroupCancel = () => {
    setLeaveGroupModalOpen(false);
  };
  const handleFile = (event) => {
    handleFileSelection(event);
    setDocsPreviewModalOpen(true);
  };

  const onFileUpload = async () => {
    await handleDocumentSubmission();
    setDocsPreviewModalOpen(false);
  };

  const handleSendTextMessage = async () => {
    sendTextMessage(textMessage);
    setTextMessage('');
  };

  return (
    <div className="h-full w-full bg-gray-100 ">
      <div className="flex flex-col h-full">
        <div className=" text-fuchsia-950 p-2 px-6 flex items-center justify-between z-50">
          <div className=" flex items-center gap-4">
            {' '}
            <img
              src={groupIcon || defaultGroupIcon}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            <h1 className="text-4xl ">{groupName}</h1>
          </div>
          <div className=" relative flex items-center justify-center p-4">
            {isMenuModalOpen ? (
              <AiOutlineMenuFold
                onClick={() => setMenuModalOpen(false)}
                className="w-7 h-7 cursor-pointer z-50"
              />
            ) : (
              <AiOutlineMenuUnfold
                onClick={() => setMenuModalOpen(true)}
                className="w-7 h-7 cursor-pointer z-50"
              />
            )}
            {isMenuModalOpen && (
              <div
                ref={menuRef}
                className="absolute top-full right-0 mt-2 z-50"
              >
                <GroupMenu
                  groupId={groupId}
                  isMenuModalOpen={isMenuModalOpen}
                  setMenuModalOpen={setMenuModalOpen}
                  setSelectedDocsIds={setSelectedDocsIds}
                  isSelectionOpen={isSelectionOpen}
                  setSelectionOpen={setSelectionOpen}
                  setAddGroupMemberModal={() => setAddGroupMemberModal(true)}
                  setViewGroupMemberModal={() => setViewGroupMemberModal(true)}
                  setRemoveGroupMemberModal={() =>
                    setRemoveGroupMemberModal(true)
                  }
                  setLeaveGroupModalOpen={() => setLeaveGroupModalOpen(true)}
                />
              </div>
            )}
            {viewGroupMemberModal && (
              <ViewGroupMemberModal
                groupMembers={groupMembers}
                onClose={() => setViewGroupMemberModal(false)}
              />
            )}
            {addGroupMemberModal && (
              <AddGroupMemberModal
                handleCopy={handleCopy}
                copied={copied}
                inviteLink={inviteLink}
                alreadyPresentUserIds={alreadyPresentUserIds}
                groupMembers={groupMembers}
                allUsers={allUsers}
                onClose={() => setAddGroupMemberModal(false)}
                onAddMembers={onAddMembers}
              />
            )}
            {removeGroupMemberModal && (
              <RemoveGroupMemberModal
                groupMembers={groupMembers}
                onClose={() => setRemoveGroupMemberModal(false)}
                onDone={() => setRemoveMemberModalOpen(true)}
                selectedUserIds={selectedUserIds}
                setSelectedUserIds={setSelectedUserIds}
              />
            )}
            {isRemoveMemberModalOpen && (
              <DeleteModal
                modalPurpose={`Are you sure to remove these members?`}
                handleModalConfirm={handleRemoveMemberConfirm}
                handleModalCancel={handleRemoveMemberCancel}
                onClose={() => setRemoveMemberModalOpen(false)}
              />
            )}
            {isLeaveGroupModalOpen && (
              <DeleteModal
                modalPurpose={`Are you sure to leave this group?`}
                handleModalConfirm={handleLeaveGroupConfirm}
                handleModalCancel={handleLeaveGroupCancel}
                onClose={() => setLeaveGroupModalOpen(false)}
              />
            )}
            {isDocsPreviewModalOpen && files.length >= 1 && (
              <DocsPreviewModal
                setDocsPreviewModalOpen={setDocsPreviewModalOpen}
                filePreviews={filePreviews}
                handleSelectionDoc={handleSelectionDoc}
                onFileUpload={onFileUpload}
              />
            )}
            <ToastContainer
              position="top-center"
              autoClose={3000}
              theme="colored"
            />
          </div>
        </div>
        <div className="relative h-full inset-shadow-fuchshia-600/80 inset-shadow-sm rounded-xl flex flex-col items-center justify-between">
          <div className="absolute top-0 left-0 bg-gray-700/20 backdrop-blur-2xl rounded-br-md shadow-2xl/30 flex p-2 z-5">
            <div
              onClick={() => navigate('/groups')}
              className=" p-2 cursor-pointer z-50"
              title="Back"
            >
              <IoMdArrowRoundBack />
            </div>
            {isSelectionOpen && (
              <div
                onClick={() => {
                  setSelectionOpen(false);
                  setSelectedDocsIds([]);
                }}
                className="text-red-500 p-2  cursor-pointer border-l border-l-gray-500"
                title="Cancel"
              >
                <TiCancel />
              </div>
            )}
          </div>
          {initialLoading && (
            <div className="h-full flex items-center justify-center ">
              <LoadingSpin />
            </div>
          )}
          {!initialLoading && (
            <GroupMessages
              loading={loadNewMessages}
              error={error}
              chatRef={chatRef}
              handleChatUpperScroll={handleChatUpperScroll}
              messages={messages}
              user={user}
              handleFile={handleFile}
              textMessage={textMessage}
              setTextMessage={setTextMessage}
              handleSendTextMessage={handleSendTextMessage}
            />
          )}
          {isSelectionOpen && selectedDocsIds.length >= 1 && (
            <DelDocButton handleDeleteDocument={handleDeleteDocument} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
