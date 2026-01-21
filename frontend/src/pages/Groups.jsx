import React, { useEffect, useRef, useState } from 'react';
import useAuthStore from '../hooks/store/useAuthStore';
import { IoAddSharp, IoClose } from 'react-icons/io5';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NewGroupModal from '../components/modals/NewGroupModal';
import defaultGroupIcon from '../assets/group-icon.jpg';
import { HiDotsVertical } from 'react-icons/hi';

const Groups = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [groupList, setGroupList] = useState([]);
  const [inviteToken, setInviteToken] = useState(null);
  const groupPageRef = useRef();
  const imageRef = useRef();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Add new group modal
  const [isNewGroupModalOpen, setNewGroupModalOpen] = useState(false);
  const [isGroupCardMenuModalOpen, setGroupCardMenuModalOpen] = useState(false);
  const [groupID, setGroupID] = useState('');
  const [isGroupDeleteModalOpen, setGroupDeleteModalOpen] = useState(false);

  const [newGroupIcon, setNewGroupIcon] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('inviteToken');
    setInviteToken(token);
    (async () => {
      if (token) {
        await fetchGroupByInviteToken(token);
      }
      await fetchUserGroups();
    })();
  }, []);

  const handleGroupDelete = async () => {
    try {
      console.log(groupID);
      const response = await api.post('/group/deleteGroup', {
        groupId: groupID,
      });
      console.log(response);
      toast.success(response.data.message || 'Group deleted', {
        position: 'top-center',
        autoClose: 3000,
        theme: 'colored',
      });
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data.message ||
          error?.message ||
          'Internal Server Error',
        {
          position: 'top-center',
          autoClose: 3000,
          theme: 'colored',
        },
      );
    }
  };

  const handleConfirmDelete = async (e) => {
    try {
      e.stopPropagation();
      await handleGroupDelete();
      await fetchUserGroups();
    } catch (error) {
      console.log(error);
    } finally {
      setGroupDeleteModalOpen(false);
      setGroupID(null);
    }
  };

  const handleDeleteCancel = (e) => {
    setGroupDeleteModalOpen(false);
    setGroupID(null);
    e.stopPropagation();
  };

  const fetchGroupByInviteToken = async (token) => {
    try {
      // console.log(token);

      const response = await api.post(
        '/group/fetchGroupByInviteToken',
        { token: token },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      console.log(response.data.groupName);

      toast.success(`User added to '${response.data.groupName}'`, {
        position: 'top-center',
        theme: 'colored',
      });
      localStorage.removeItem('inviteToken');
    } catch (error) {
      console.log('Error while fetching details through invite token', error);

      console.log(error?.response.data.groupName);

      if (error?.response.status === 409) {
        toast.error(
          `User already exists in '${error?.response.data.groupName}'`,
          {
            position: 'top-center',
            theme: 'colored',
          },
        );
        localStorage.removeItem('inviteToken');
      }
    }
  };

  const handleScroll = () => {
    const element = groupPageRef.current;

    if (!element || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = element;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      loadMoreGroups();
    }
  };

  const fetchUserGroups = async () => {
    try {
      setIsLoading(true);

      const params = {
        page: 1,
        limit: 8,
      };

      const response = await api.get('/group/groups', {
        params: params,
      });

      setGroupList(response.data.groups);
      setHasMore(response.data.groups.length === 8);
      setPage(2);
    } catch (error) {
      toast.error(
        error?.message ||
          error?.response?.data.message ||
          'Server error while loading groups',
        {
          position: 'top-center',
          autoClose: 3000,
          theme: 'colored',
        },
      );
      setError('Server error while loading groups');
      console.log("Error while fetching user's group", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIcon = (e) => {
    const imageInput = e.target;
    if (imageInput.files && imageInput.files[0]) {
      setNewGroupIcon(imageInput.files[0]);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        imageRef.current.src = e.target.result;
      };
      fileReader.readAsDataURL(imageInput.files[0]);
    }
  };

  const loadMoreGroups = async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const params = {
        page: page,
        limit: 8,
      };

      const response = await api.get('/group/groups', {
        params: params,
      });

      const newGroups = response.data.groups;

      if (newGroups.length === 0) {
        setHasMore(false);
      } else {
        setGroupList((prev) => [...prev, ...newGroups]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(
        error?.message ||
          error?.response?.data.message ||
          'Server error on loading more groups',
        {
          position: 'top-center',
          autoClose: 3000,
          theme: 'colored',
        },
      );
      setError('Server error while loading more groups');
      console.log('Error loading more groups', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCreateGroup = async () => {
    try {
      const formData = new FormData();
      if (newGroupIcon) {
        console.log(newGroupIcon);
        formData.append('newGroupIcon', newGroupIcon);
      }
      formData.append('newGroupName', newGroupName);
      formData.append('newGroupDescription', newGroupDescription);

      console.log(newGroupName);
      console.log(newGroupDescription);

      const response = await api.post('/group/createGroup', formData);
      console.log(response);
      setNewGroupIcon('');
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupModalOpen(false);
      await fetchUserGroups();
    } catch (error) {
      console.log(error);

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
    }
  };
  return (
    <div className="h-full w-full bg-gray-100 min-h-0">
      <div className="flex flex-col h-full">
        <div className="flex p-4 px-6 pr-12 items-center justify-between">
          <h1 className="text-fuchsia-950 text-4xl">Groups</h1>
          {user.role === 'admin' && (
            <button
              onClick={() => setNewGroupModalOpen(true)}
              className="bg-fuchsia-600 rounded-md p-2 px-4 flex items-center justify-center cursor-pointer gap-2 text-white"
              title="Add new group"
            >
              <p>New Group</p>
              <p className="text-2xl">+</p>
            </button>
          )}
        </div>
        <ToastContainer
          position="top-centred"
          theme="colored"
          autoClose={3000}
          style={{ width: 'fit-content' }}
        />
        {isNewGroupModalOpen && (
          <NewGroupModal
            onClose={() => setNewGroupModalOpen(false)}
            imageRef={imageRef}
            handleIcon={handleIcon}
            newGroupName={newGroupName}
            setNewGroupIcon={setNewGroupIcon}
            setNewGroupName={setNewGroupName}
            setNewGroupDescription={setNewGroupDescription}
            onCreateGroup={onCreateGroup}
          />
        )}
        <div
          ref={groupPageRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 inset-shadow-fuchshia-600/80 rounded-xl inset-shadow-sm overflow-y-auto hide-scrollbar"
        >
          {isLoading && groupList.length === 0 && (
            <div className="flex h-full w-full items-center justify-center">
              <div className="animate-spin border-4 border-fuchsia-200 border-t-fuchsia-700 border-r-fuchsia-700 border-b-fuchsia-700 rounded-full w-12 h-12" />
            </div>
          )}

          {!isLoading && groupList.length === 0 && !error && (
            <div className="flex h-full w-full items-center justify-center text-gray-500 text-lg">
              No groups available
            </div>
          )}

          {!isLoading && error && groupList.length === 0 && (
            <div className="flex h-full w-full items-center justify-center ">
              <div className="border text-red-500 text-md p-10 rounded-md bg-red-50 shadow-2xl/40 flex flex-col items-center gap-4">
                <span className="font-semibold"> Error : {error} </span>
                <button
                  onClick={fetchUserGroups}
                  className="border p-1 px-4 rounded-md hover:bg-red-300 cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {groupList.length > 0 && (
            <ul className="px-6 py-4 w-full flex flex-wrap gap-6">
              {groupList.map((group) => (
                <li
                  key={group._id}
                  onClick={() => navigate(`/groups/${group.groupId?._id}`)}
                  className="relative overflow-hidden h-80 w-60 bg-white rounded-lg shadow-xl/20 cursor-pointer"
                >
                  {user.role === 'admin' && (
                    <div
                      onClick={(e) => {
                        setGroupID(group.groupId?._id);
                        isGroupCardMenuModalOpen
                          ? setGroupCardMenuModalOpen(false)
                          : setGroupCardMenuModalOpen(true);
                        e.stopPropagation();
                      }}
                      className="absolute top-2 right-0 p-2 z-50"
                    >
                      <HiDotsVertical className="w-5 h-5" />
                    </div>
                  )}
                  {isGroupCardMenuModalOpen &&
                    groupID === group.groupId?._id && (
                      <div
                        onClick={(e) => {
                          setGroupDeleteModalOpen(true);
                          e.stopPropagation();
                        }}
                        className="absolute rounded-b-lg rounded-l-lg p-2 px-4 bg-fuchsia-800/20 backdrop-blur-3xl top-6 right-6 z-50 text-gray-700"
                      >
                        Delete Group
                      </div>
                    )}
                  {isGroupDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                      <div
                        onClick={(e) => {
                          setGroupDeleteModalOpen(false);
                          e.stopPropagation();
                        }}
                        className="absolute inset-0 bg-black/20"
                      ></div>
                      <div className="relative bg-white w-full max-w-md shadow-lg py-10 px-8  flex flex-col items-center gap-8 rounded-lg">
                        <div
                          onClick={(e) => {
                            setGroupDeleteModalOpen(false);
                            e.stopPropagation();
                          }}
                          className="absolute -top-5 -right-5 bg-fuchsia-50 hover:bg-fuchsia-100 transition-all p-2 rounded-full cursor-pointer"
                        >
                          <IoClose className="w-6 h-6" />
                        </div>
                        <p className="text-xl text-fuchsia-950 font-semibold">
                          Are you sure to delete this group?
                        </p>
                        <div className="flex items-center justify-around w-full gap-4">
                          <button
                            onClick={(e) => handleConfirmDelete(e)}
                            className="bg-red-400 border-2 border-red-400 text-white  py-2 px-8 rounded-md
                    hover:border-red-600 
                    hover:bg-red-600  cursor-pointer transition-all"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={(e) => handleDeleteCancel(e)}
                            className="border-2 border-green-400 text-green-400
                    hover:text-green-600
                    hover:border-green-600 py-2 px-8 rounded-md cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* gradients */}
                  <div
                    className="absolute -top-30 -right-30 h-74 w-64 rounded-full z-0
    bg-[radial-gradient(circle,rgba(255,27,145,0.2)_0%,transparent_70%)]"
                  />

                  <div
                    className="absolute -bottom-64 -left-20 h-94 w-94 rounded-full z-0
    bg-[radial-gradient(circle,rgba(224,113,38,0.4)_0%,transparent_60%)]"
                  />
                  <div
                    className="absolute -bottom-16 -right-40 h-94 w-94 rounded-full z-0
    bg-[radial-gradient(circle,rgba(64,224,38,0.1)_0%,transparent_60%)]"
                  />
                  <div
                    className="absolute -bottom-16 -left-40 h-94 w-94 rounded-full z-0
    bg-[radial-gradient(circle,rgba(38,212,224,0.3)_0%,transparent_60%)]"
                  />
                  {/* rgba(164,38,224,0.17) */}
                  <div
                    className="absolute -top-20 -left-24 h-64 w-64 rounded-full z-0
    bg-[radial-gradient(circle,rgba(164,38,224,0.17)_0%,transparent_60%)]"
                  />

                  <div className="relative z-10 flex flex-col items-center justify-between h-full p-6">
                    <div className="rounded-full overflow-hidden bg-white w-40 h-40">
                      <img
                        src={group.groupId?.icon || defaultGroupIcon}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>

                    <p className="text-xl font-semibold uppercase tracking-widest">
                      {group.groupId?.name}
                    </p>

                    <p className="text-sm text-gray-400 font-semibold truncate text-wrap h-10 w-50 text-center">
                      {group.groupId?.description}
                    </p>
                  </div>
                </li>
              ))}
              {isLoading && hasMore && (
                <li className="w-full flex justify-center py-6">
                  <div className="flex items-center justify-center z-50">
                    <div className="animate-spin border-4 border-fuchsia-200 border-t-fuchsia-700 border-r-fuchsia-700 border-b-fuchsia-700 rounded-full w-12 h-12" />
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Groups;
