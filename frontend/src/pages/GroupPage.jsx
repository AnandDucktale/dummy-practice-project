import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaCheck, FaShare } from 'react-icons/fa';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
import { AiOutlineMenuFold } from 'react-icons/ai';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {
  MdDeleteOutline,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { ImCross } from 'react-icons/im';
import { TiCancel } from 'react-icons/ti';

import api from '../api/axios';
import pdfPNG from '../assets/pdf.png';
import cssPNG from '../assets/css.png';
import spreadSheetPNG from '../assets/spreadsheet.png';
import jsonPNG from '../assets/json.png';
import jsPNG from '../assets/javascript.png';
import htmlPNG from '../assets/html.png';
import videoPNG from '../assets/video.png';
import audioPNG from '../assets/audio.png';
import markdownPNG from '../assets/markdown.png';
import docxPNG from '../assets/document.png';
import txtPNG from '../assets/txt.png';
import useAuthStore from '../hooks/store/useAuthStore.jsx';
import AddGroupMemberModal from '../components/modals/AddGroupMemberModal';
import ViewGroupMemberModal from '../components/modals/ViewGroupMemberModal';
import GroupMenu from '../components/GroupMenu';
import RemoveGroupMemberModal from '../components/modals/RemoveGroupMemberModal';
import defaultGroupIcon from '../assets/group-icon.jpg';

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

  // File selection
  const [isSelectionOpen, setSelectionOpen] = useState(false);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!groupId) return;

    fetchGroupDetail(groupId);
    fetchGroupMembers(groupId);
    if (user.role === 'admin') {
      generateInviteLink(groupId);
      fetchAllUsers();
    }
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

  const handleDeleteDocument = async () => {
    try {
      const response = await api.post('/group/deleteDocuments', {
        selectedDocsIds: selectedDocsIds,
      });

      toast.success(response?.data.message || 'Documents deleted', {
        position: 'top-center',
        autoClose: 3000,
        theme: 'colored',
      });

      setSelectedDocsIds([]);
      setSelectionOpen(false);
      await fetchGroupData(groupId);
    } catch {
      toast.error(
        error?.response?.data.message ||
          error?.message ||
          'Inernal Server Error',
        {
          position: 'top-center',
          autoClose: 3000,
          theme: 'colored',
        },
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
      console.log(response);
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
        toast.error(error?.response?.data.message || error?.message, {
          position: 'top-center',
          theme: 'colored',
          autoClose: 3000,
        });
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

  // pagination

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPageNumber(page);
    }
  };
  const getDisplayPages = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, pageNumber - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };
  // pagination

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
        {
          position: 'top-center',
          theme: 'colored',
          autoClose: 3000,
        },
      );
      setError('Server error while loading group detail');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupData = async (groupId) => {
    setGroupDetails([]);
    setLoading(true);

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
    } catch (error) {
      // console.log('Error while removing users', error);
      toast.error(error?.response?.data.message || 'Internal Server Error', {
        autoClose: 3000,
        position: 'top-center',
        theme: 'colored',
      });
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

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files);
    const filteredFiles = files.filter((file) => file.size <= 1048576 * 2);
    setFiles(filteredFiles);
    setDocsPreviewModalOpen(true);
    handleFilePreviews(event);
  };

  const handleFilePreviews = (event) => {
    const files = Array.from(event.target.files);
    // setFiles(files);
    // console.log(files);

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.split('/')[0],
    }));
    // console.log(previews);
    const filteredPreviews = previews.filter(
      (preview) => preview.file.size <= 1048576 * 2,
    );

    if (filteredPreviews.length !== previews.length) {
      toast.warn('File size not more than 2MB.');
    }
    files.forEach((file) => console.log(file));

    setFilePreviews(filteredPreviews);
  };

  const handleDocumentSubmission = async () => {
    try {
      setLoading(true);

      if (files.length === 0) return;
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('documents', file);
      });

      formData.append('groupId', groupId);

      const response = await api.post('/group/sendDocument', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response?.data.message || 'Documents Uploaded');
      await fetchGroupData(groupId);
    } catch (error) {
      // console.log(error);
      toast.error(
        error?.message ||
          error.response?.data.message ||
          'Internal server error',
        {
          position: 'top-center',
          theme: 'colored',
          autoClose: 3000,
        },
      );
    } finally {
      setDocsPreviewModalOpen(false);
      setFilePreviews([]);
      setFiles([]);
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
                onRemoveMembers={onRemoveMembers}
              />
            )}
            {isDocsPreviewModalOpen && files.length >= 1 && (
              <div className="fixed flex items-center justify-center inset-0 z-50">
                <div
                  className="inset-0 absolute bg-black/50"
                  onClick={() => {
                    setDocsPreviewModalOpen(false);
                  }}
                ></div>
                <div className="relative bg-gray-400 inset-0 z-100 rounded-md shadow-xl/30 p-6 flex  gap-4 min-w-0 flex-col w-full max-w-2xl">
                  <h1 className="text-4xl py-2">Selected Files</h1>
                  <div className="flex flex-wrap gap-6 p-6  bg-white/50 backdrop-blur-3xl inset-shadow-xs/45 inset-shadow-gray-500 rounded-md overflow-y-auto hide-scrollbar h-120">
                    {filePreviews.map((preview, index) => {
                      return (
                        <div
                          key={index}
                          className="relative bg-black/40 backdrop-blur-2xl rounded-xl flex flex-col items-center p-4 w-38 h-38 justify-between"
                          title={preview.file.name}
                        >
                          <div
                            onClick={() => {
                              setFiles((prev) =>
                                prev.filter(
                                  (item) => item.name !== preview.file.name,
                                ),
                              );
                              setFilePreviews((prev) =>
                                prev.filter(
                                  (item) =>
                                    item.file.name !== preview.file.name,
                                ),
                              );
                            }}
                            className="absolute top-0 right-0 bg-red-500 w-5 h-5 flex items-center justify-center rounded-bl-md p-1 z-1000 text-white cursor-pointer"
                          >
                            <ImCross />
                          </div>
                          {preview.type === 'image' && (
                            <img
                              src={preview.url}
                              alt={`preview ${index}`}
                              className="w-20 h-20 object-cover "
                            />
                          )}
                          {preview.file.type === 'application/pdf' && (
                            <a href={preview.url} alt={`preview ${index}`}>
                              <img
                                src={pdfPNG}
                                alt="pdf"
                                className="w-20 h-20 object-cover "
                              />
                            </a>
                          )}
                          {preview.file.type === 'text/html' && (
                            <a href={preview.url} alt={`preview ${index}`}>
                              <img
                                src={htmlPNG}
                                alt="html"
                                className="w-20 h-20 object-cover "
                              />
                            </a>
                          )}
                          {preview.file.type === 'text/css' && (
                            <a href={preview.url} alt={`preview ${index}`}>
                              <img
                                src={cssPNG}
                                alt="css"
                                className="w-20 h-20 object-cover "
                              />
                            </a>
                          )}
                          {preview.file.type === 'text/markdown' && (
                            <a href={preview.url} alt={`preview ${index}`}>
                              <img
                                src={markdownPNG}
                                alt="markdown"
                                className="w-20 h-20 object-cover "
                              />
                            </a>
                          )}
                          {preview.file.type === 'text/plain' && (
                            <a href={preview.url} alt={`preview ${index}`}>
                              <img
                                src={txtPNG}
                                alt="txt"
                                className="w-20 h-20 object-cover "
                              />
                            </a>
                          )}
                          {preview.file.type ===
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && (
                            <a href={preview.url} alt={`preview ${index}`}>
                              <img
                                src={spreadSheetPNG}
                                alt="document"
                                className="w-20 h-20 object-cover "
                              />
                            </a>
                          )}
                          {preview.file.type === 'text/javascript' && (
                            <a href={preview.url} alt={`preview ${index}`}>
                              <img
                                src={jsPNG}
                                alt="js file"
                                className="w-20 h-20 object-cover "
                              />
                            </a>
                          )}
                          {preview.file.type === 'application/msword' && (
                            <a href={preview.url} alt={`preview ${index}`}>
                              <img
                                src={docxPNG}
                                alt="document"
                                className="w-20 h-20 object-cover "
                              />
                            </a>
                          )}
                          {preview.file.type === 'text/json' && (
                            <a href={preview.url} alt={`preview ${index}`}>
                              <img
                                src={jsonPNG}
                                alt="json"
                                className="w-20 h-20 object-cover "
                              />
                            </a>
                          )}
                          {preview.file.type ===
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
                            <a href={preview.url} alt={`preview ${index}`}>
                              <img
                                src={docxPNG}
                                alt="document"
                                className="w-20 h-20 object-cover "
                              />
                            </a>
                          )}
                          <p className="text-black truncate w-30">
                            {preview.file.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-end justify-end gap-4 p-4">
                    <button
                      onClick={() => handleDocumentSubmission()}
                      className="cursor-pointer bg-fuchsia-600 text-white p-1 px-6 rounded-md hover:bg-fuchsia-800 transition-all"
                    >
                      Upload
                    </button>
                    <button
                      onClick={(e) => setDocsPreviewModalOpen(false)}
                      className="bg-fuchsia-600 text-white cursor-pointer p-1 px-6 rounded-md hover:bg-fuchsia-800 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
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
              <div className="h-12 w-12 rounded-full border-t-4 border-r-4 border-b-4 border-4 border-t-fuchsia-800 border-r-fuchsia-800 border-b-fuchsia-700 border-fuchsia-300 animate-spin"></div>
            </div>
          )}
          {user && groupDetails.length !== 0 && (
            <ul className="grid xl:grid-cols-6  md:grid-cols-4 sm:grid-cols-2 gap-6">
              {groupDetails.map((item) => {
                const isCurrentUser = item?.senderId?._id === user?._id;

                return (
                  <li key={item._id}>
                    <div className="bg-black/10 backdrop-blur-2xl rounded-lg shadow-2xl/10 p-4 flex flex-col items-center overflow-hidden relative">
                      {isSelectionOpen &&
                        (isCurrentUser || user.role === 'admin') && (
                          <div
                            onClick={() => {
                              selectedDocsIds.includes(item._id)
                                ? setSelectedDocsIds((prev) =>
                                    prev.filter((id) => id !== item._id),
                                  )
                                : setSelectedDocsIds((prev) => [
                                    ...prev,
                                    item._id,
                                  ]);
                            }}
                            className="absolute top-1 right-1  border bg-white rounded-full w-4 h-4 overflow-hidden cursor-pointer"
                          >
                            {selectedDocsIds.includes(item._id) && (
                              <FaCheck className="w-full h-full text-white bg-fuchsia-600 p-1 " />
                            )}
                          </div>
                        )}
                      <a
                        href={item.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col gap-2 items-center"
                        title={item.fileName}
                      >
                        {item.fileExt === '.pdf' && (
                          <img
                            src={pdfPNG}
                            alt="pdf"
                            className="w-20 h-20 object-cover"
                          />
                        )}
                        {item.fileExt === '.xlsx' && (
                          <img
                            src={spreadSheetPNG}
                            alt="spreadsheet"
                            className="w-20 h-20 object-cover"
                          />
                        )}
                        {item.fileExt === '.xls' && (
                          <img
                            src={spreadSheetPNG}
                            alt="spreadsheet"
                            className="w-20 h-20 object-cover"
                          />
                        )}
                        {item.fileExt === '.docx' && (
                          <img
                            src={docxPNG}
                            alt="document"
                            className="w-20 h-20 object-cover"
                          />
                        )}
                        {item.fileExt === '.doc' && (
                          <img
                            src={docxPNG}
                            alt="document"
                            className="w-20 h-20 object-cover"
                          />
                        )}
                        {item.fileExt === '.txt' && (
                          <img
                            src={txtPNG}
                            alt="document"
                            className="w-20 h-20 object-cover"
                          />
                        )}
                        {item.fileExt === '.html' && (
                          <img
                            src={htmlPNG}
                            alt="html"
                            className="w-20 h-20 object-cover"
                          />
                        )}
                        {item.fileExt === '.css' && (
                          <img
                            src={cssPNG}
                            alt="css"
                            className="w-20 h-20 object-cover"
                          />
                        )}
                        {item.fileExt === '.js' && (
                          <img
                            src={jsPNG}
                            alt="pdf"
                            className="w-20 h-20 object-cover"
                          />
                        )}
                        {item.fileExt === '.json' && (
                          <img
                            src={jsonPNG}
                            alt="pdf"
                            className="w-20 h-20 object-cover"
                          />
                        )}
                        {item.fileExt === '.md' && (
                          <img
                            src={markdownPNG}
                            alt="pdf"
                            className="w-20 h-20 object-cover"
                          />
                        )}
                        {item.fileExt === '.jpg' && (
                          <img
                            src={item.documentUrl}
                            alt="pdf"
                            className="w-20 h-20 object-cover"
                          />
                        )}
                        {item.fileExt === '.jpeg' && (
                          <img
                            src={item.documentUrl}
                            alt="pdf"
                            className="w-20 h-20 object-cover"
                          />
                        )}
                        {item.fileExt === '.png' && (
                          <img
                            src={item.documentUrl}
                            alt="pdf"
                            className="w-20 h-20 object-cover"
                          />
                        )}

                        <span className="text-sm truncate max-w-26">
                          {item.fileName}
                        </span>

                        <p className="text-xs">
                          <span>
                            {isCurrentUser ? (
                              'You'
                            ) : (
                              <span>
                                Sent by{' '}
                                <span className="text-fuchsia-700">
                                  {item?.senderId?.firstName}
                                </span>
                              </span>
                            )}
                          </span>
                        </p>
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {!loading && !error && groupDetails.length === 0 && (
            <div className="flex flex-1 items-center justify-center">
              No document available. . .
            </div>
          )}{' '}
          {!loading && error && (
            <div className="h-full flex items-center justify-center">
              <div className="bg-red-100 p-4 text-red-600 border rounded-md flex flex-col items-center justify-center gap-6 shadow-2xl/30">
                <span className="">Error : {error}</span>
                <button
                  onClick={fetchGroupData}
                  className="cursor-pointer border p-1 px-4 rounded-md hover:bg-red-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          <div className="fixed bottom-20 right-10 text-4xl ">
            <label
              htmlFor="document"
              className="text-white cursor-pointer p-4 bg-fuchsia-800 rounded-full w-16 h-16 flex items-center justify-center"
              title="Share Document"
            >
              <FaShare className="w-4 h-4" />
            </label>
            <input
              type="file"
              name="document"
              id="document"
              className="hidden"
              onChange={(event) => {
                handleFileSelection(event);
              }}
              accept="image/jpeg, image/jpg, image/png, image/webp, video/mp4, audio/mp3,text/plain,text/html, 	application/msword, text/css, text/javascript, text/json, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf, text/markdown, application/vnd.ms-excel"
              multiple
            />
          </div>
          {isSelectionOpen && selectedDocsIds.length >= 1 && (
            <div className="fixed bottom-20 right-30 text-4xl ">
              <div
                onClick={handleDeleteDocument}
                className="text-white cursor-pointer p-4 bg-fuchsia-800 rounded-full w-16 h-16 flex items-center justify-center"
                title="Delete Document"
              >
                <MdDeleteOutline className="w-6 h-6" />
              </div>
            </div>
          )}
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="p-6 max-w-3xl w-full  min-w-0 ">
              <div className="flex justify-around items-center gap-4 ">
                {/* First page and Previous page */}
                <div className="flex gap-2">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={pageNumber === 1}
                    className="p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 disabled:hover:bg-gray-100 rounded-full"
                    title="First Page"
                  >
                    <MdKeyboardDoubleArrowLeft />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => goToPage(pageNumber - 1)}
                    disabled={pageNumber === 1}
                    className="p-2 cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 disabled:hover:bg-gray-100 rounded-full "
                    title="Previous Page"
                  >
                    <FiChevronLeft />
                  </button>
                </div>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getDisplayPages().map((page) => {
                    return (
                      <div key={page} className="flex items-center">
                        <button
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-full mx-1 cursor-pointer ${
                            pageNumber === page
                              ? 'bg-fuchsia-600 text-white'
                              : 'hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Last page and Next Page */}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(pageNumber + 1)}
                    disabled={pageNumber === totalPages}
                    className="p-2 cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed
                                     hover:bg-gray-200
                                     disabled:hover:bg-gray-100  rounded-full"
                    title="Next Page"
                  >
                    <FiChevronRight />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={pageNumber === totalPages}
                    className="p-2 cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed
                                     hover:bg-gray-300
                                     disabled:hover:bg-gray-100  rounded-full"
                    title="Jump to last Page"
                  >
                    <MdKeyboardDoubleArrowRight />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
