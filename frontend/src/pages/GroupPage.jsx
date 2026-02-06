import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
import { AiOutlineMenuFold } from 'react-icons/ai';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { TiCancel } from 'react-icons/ti';

import api from '../api/axios';
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
} from '../hooks/socket-events/groupEvents.jsx';
import { getSocket } from '../api/socket.js';
import Pagination from '../components/Pagination.jsx';
import LoadingSpin from '../components/LoadingSpin.jsx';
import NoData from '../components/NoData.jsx';
import DocShareButton from '../components/DocShareButton.jsx';
import DelDocButton from '../components/DelDocButton.jsx';
import { uploadDocument } from '../services/groupPage.services.js';
import GroupPageDocuments from '../components/GroupPageDocuments.jsx';
import Error from '../components/Error.jsx';

const GroupPage = () => {
  const menuRef = useRef(null);

  const { groupId } = useParams();

  const navigate = useNavigate();

  const { user } = useAuthStore();

  // Page State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Document Limit
  const docsLimit = 12;

  // Groups state
  const [groupName, setGroupName] = useState('');
  const [groupIcon, setGroupIcon] = useState('');
  const [groupDetails, setGroupDetails] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [alreadyPresentUserIds, setAlreadyPresentUserIds] = useState([]);
  const [inviteLink, setInviteLink] = useState('');
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
  const [filePreviews, setFilePreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    if (!groupId) return;
    // Socket room
    joinGroupRoom(groupId);

    // Attach handler to socket
    getSocket().on('document:new', newDocumentHandler);

    fetchGroupDetail(groupId);
    fetchGroupMembers(groupId);
    if (user.role === 'admin') {
      generateInviteLink(groupId);
      fetchAllUsers();
    }
    return () => {
      // Remove handler
      getSocket().off('document:new', newDocumentHandler);

      // Then leave group
      leaveGroupRoom(groupId);
    };
  }, [groupId]);

  useEffect(() => {
    fetchGroupData(groupId);
  }, [groupId, pageNumber]);

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

  const toastParameters = {
    position: 'top-center',
    autoClose: 3000,
    theme: 'colored',
  };

  const newDocumentHandler = async () => {
    if (pageNumber === 1) {
      setGroupDetails([]);
      await fetchGroupData(groupId);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      const response = await api.post('/group/deleteDocuments', {
        selectedDocsIds: selectedDocsIds,
      });

      toast.success(
        response?.data.message || 'Documents deleted',
        toastParameters,
      );

      setSelectedDocsIds([]);
      setSelectionOpen(false);
      await fetchGroupData(groupId);
    } catch {
      toast.error(
        error?.response?.data.message ||
          error?.message ||
          'Inernal Server Error',
        toastParameters,
      );
    }
  };

  const leaveGroup = async (userId, groupId) => {
    setMenuModalOpen(false);
    try {
      const response = await api.post(
        '/group/leaveGroup',
        { userId, groupId },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      // console.log(response);
      // const groupIds = await fetchUserGroupIds();
      // console.log(groupIds);

      // const groupIdNumber = groupIds[groupIds.length - 1];

      // console.log(groupIdNumber);

      // if (groupIds.length > 0) {
      //   navigate('/group-page', {
      //     state: { groupId: groupIdNumber },
      //   });
      // } else {
      //   navigate('/groups');
      // }
      // setTimeout(() => {
      //   navigate('/my-groups');
      // }, 1000);
      navigate('/groups');
    } catch (error) {
      if (error?.response?.status === 404 || error?.response?.status === 400) {
        toast.error(
          error?.response?.data.message || error?.message,
          toastParameters,
        );
      }
    }
  };

  const fetchUserGroupIds = async () => {
    try {
      const params = {
        userId: user._id,
      };
      const response = await api.get('/group/myGroups', { params: params });

      const arr = response.data?.groups;

      const userGroupIds = arr.map((item) => item.groupId?._id);

      return userGroupIds;

      // setGroupList(response.data.groups);
    } catch (error) {
      // console.log("Error while fetching user's group", error);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchGroupDetail = async (groupId) => {
    try {
      setLoading(true);
      const params = {
        groupId: groupId,
      };
      const response = await api.get('/group/groupDetail', { params: params });
      //   console.log(response.data?.groupName.name);
      setGroupName(response.data?.groupDetail.name);
      setGroupIcon(response.data?.groupDetail.icon);
    } catch (error) {
      // console.log('Error while fetching group detail', error);
      toast.error(
        error?.message ||
          error?.response?.data.message ||
          'Internal server error',
        toastParameters,
      );
      setError('Server error while loading group detail');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupData = async (groupId) => {
    setGroupDetails([]);
    setLoading(true);
    setError('');

    try {
      const params = {
        groupId: groupId,
        docsLimit: docsLimit,
        page: pageNumber,
      };
      const response = await api.get('/group/groupData', { params: params });

      setGroupDetails(response.data?.groupDetail);
      setTotalPages(response.data?.totalPages);
    } catch (error) {
      // console.log('Error while fetching single group data', error);
      setError('Server error while loading group detail');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupMembers = async (groupId) => {
    try {
      const params = {
        groupId: groupId,
      };
      const response = await api.get('/group/groupMembers', { params: params });

      setGroupMembers(response.data?.groupMembers);

      response.data?.groupMembers.forEach((member) => {
        const memberId = member.userId._id;
        // console.log(memberId);

        setAlreadyPresentUserIds((prev) => [...prev, memberId]);
      });
    } catch (error) {
      // console.log('Error while fetching group members', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get('/admin/getAllusers');

      if (response.status === 200) {
        setAllUsers(response.data.users);
      }
      await fetchGroupMembers(groupId);
    } catch (error) {
      // console.log('Error while fetching all users', error);
    }
  };

  const onAddMembers = async (selectedUserIds) => {
    // console.log(selectedUserIds);
    try {
      const response = await api.post(
        '/group/addMemberToGroup',
        { groupId, selectedUserIds },
        { headers: { 'Content-Type': 'application/json' } },
      );
    } catch (error) {
      // console.log('Error while adding more users', error);
    } finally {
      await fetchGroupMembers(groupId);
      await fetchAllUsers();
    }
  };

  const onRemoveMembers = async (selectedUserIds) => {
    try {
      const response = await api.post(
        '/group/removeMemberFromGroup',
        { groupId, selectedUserIds },
        { headers: { 'Content-Type': 'application/json' } },
      );
      toast.success(
        response?.data.message || 'Members removed from group',
        toastParameters,
      );
    } catch (error) {
      // console.log('Error while removing users', error);
      toast.error(
        error?.response?.data.message || 'Internal Server Error',
        toastParameters,
      );
    } finally {
      await fetchGroupData(groupId);
      await fetchGroupMembers(groupId);
      await fetchAllUsers();
    }
  };

  const generateInviteLink = async (groupId) => {
    try {
      const response = await api.post(
        '/group/generateInviteToken',
        { groupId: groupId },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      // console.log(response.data?.inviteLink);
      setInviteLink(response.data?.inviteLink);
    } catch (error) {
      // console.log('Error while generating invite link', error);
    }
  };

  const handleRemoveMemberConfirm = async () => {
    try {
      await onRemoveMembers(selectedUserIds);
    } catch (error) {
      // console.log(error);
    } finally {
      setRemoveMemberModalOpen(false);
      setSelectedUserIds([]);
    }
  };

  const handleRemoveMemberCancel = () => {
    setRemoveMemberModalOpen(false);
    setSelectedUserIds([]);
  };

  const handleLeaveGroupConfirm = async () => {
    try {
      await leaveGroup(user._id, groupId);
    } catch (error) {
      // console.log(error);
    } finally {
      setLeaveGroupModalOpen(false);
      // setSelectedUserIds(null);
    }
  };

  const handleLeaveGroupCancel = () => {
    setLeaveGroupModalOpen(false);
    // setSelectedUserIds(null);
  };

  const handleFileSelection = async (event) => {
    await handleFilePreviews(event);
    const files = Array.from(event.target.files);
    const filteredFiles = files.filter((file) => {
      if (file.type === 'video/mp4' || file.type === 'video/mpeg') {
        return file.size <= 1048576 * 15;
      } else if (file.type === 'audio/mpeg') {
        return file.size <= 1048576 * 5;
      } else {
        return file.size <= 1048576 * 2;
      }
    });

    setFiles(filteredFiles);
    setDocsPreviewModalOpen(true);
  };
  // setRemoveGroupMemberModal;

  const handleFilePreviews = async (event) => {
    const files = Array.from(event.target.files);
    // setFiles(files);
    // console.log(files);

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.split('/')[0],
    }));

    const filteredPreviews = previews.filter((preview) => {
      if (preview.type === 'video') {
        return preview.file.size <= 1048576 * 15;
      } else if (preview.type === 'audio') {
        return preview.file.size <= 1048576 * 5;
      } else {
        return preview.file.size <= 1048576 * 2;
      }
    });

    const fetchThumbnail = async () => {
      for (let preview of filteredPreviews) {
        if (preview.type === 'video') {
          // console.log(preview.split('blob:')[0]);

          const thumbnailBlob = await getThumbnail(preview.file);

          const url = URL.createObjectURL(thumbnailBlob);

          preview.thumbnail = url;
          // preview.thumbnail = thumbnailBlob;
          // console.log(preview);
          // console.log(thumbnailBlob);
        }
      }
    };
    await fetchThumbnail();

    if (filteredPreviews.length !== previews.length) {
      toast.warn('File size not more than its limit');
    }
    // files.forEach((file) => console.log(file));

    setFilePreviews(filteredPreviews);
  };

  const getThumbnail = async (videoFile, seekTime = 0.2) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(videoFile);

      video.src = url;
      video.muted = true;
      video.playsInline = true;

      video.addEventListener('loadeddata', () => {
        video.currentTime = Math.min(seekTime, video.duration);
      });

      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            resolve(blob);
          },
          'image/jpeg',
          0.75,
        );

        // const dataUrl = canvas.toDataURL('image/jpeg');
        // resolve(dataUrl);
      });

      video.onerror = (err) => reject('Video loading failed');
    });
  };

  const handleDocumentSubmission = async () => {
    try {
      setLoading(true);

      const data = await uploadDocument({ files, groupId });

      toast.success(data.message || 'Documents Uploaded', toastParameters);

      setDocsPreviewModalOpen(false);
      setFilePreviews([]);
      setFiles([]);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Internal server error',
        toastParameters,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-gray-100 ">
      <div className="flex flex-col h-full">
        <div className=" text-fuchsia-950 p-2 px-6 flex items-center justify-between">
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
                className="w-7 h-7 cursor-pointer"
              />
            ) : (
              <AiOutlineMenuUnfold
                onClick={() => setMenuModalOpen(true)}
                className="w-7 h-7 cursor-pointer"
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
                  leaveGroup={leaveGroup}
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
                setFiles={setFiles}
                setFilePreviews={setFilePreviews}
                handleDocumentSubmission={handleDocumentSubmission}
              />
            )}
            <ToastContainer
              position="top-center"
              autoClose={3000}
              theme="colored"
            />
          </div>
        </div>
        <div className="relative h-full px-20 py-8  inset-shadow-fuchshia-600/80 inset-shadow-sm rounded-xl flex flex-col items-center justify-between overflow-y-auto hide-scrollbar">
          <div className="absolute top-0 left-0 bg-gray-700/20 backdrop-blur-2xl rounded-br-md shadow-2xl/30 flex p-2">
            <div
              onClick={() => navigate('/groups')}
              className=" p-2 cursor-pointer"
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
          {loading && (
            <div className="h-full flex items-center justify-center ">
              <LoadingSpin />
            </div>
          )}
          {!loading && !error && groupDetails.length === 0 && (
            <NoData cause={` No document available. . .`} />
          )}{' '}
          {!loading && error && (
            <Error refresh={() => fetchGroupData(groupId)} error={error} />
          )}
          {user && groupDetails.length !== 0 && (
            <ul className="grid xl:grid-cols-6  md:grid-cols-4 sm:grid-cols-2 gap-6">
              {groupDetails.map((item) => {
                const isCurrentUser = item?.senderId?._id === user?._id;

                return (
                  <li key={item._id}>
                    <GroupPageDocuments
                      isSelectionOpen={isSelectionOpen}
                      isCurrentUser={isCurrentUser}
                      user={user}
                      selectedDocsIds={selectedDocsIds}
                      setSelectedDocsIds={setSelectedDocsIds}
                      item={item}
                    />
                  </li>
                );
              })}
            </ul>
          )}
          {/* Document sharing button */}
          <DocShareButton handleFileSelection={handleFileSelection} />
          {/* Document delete button */}
          {isSelectionOpen && selectedDocsIds.length >= 1 && (
            <DelDocButton handleDeleteDocument={handleDeleteDocument} />
          )}
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
