import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import { GrFormView } from 'react-icons/gr';
import { GrFormViewHide } from 'react-icons/gr';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineDelete,
} from 'react-icons/md';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdClear } from 'react-icons/md';

import useAuthStore from '../hooks/store/useAuthStore';
import api from '../api/axios';
import defaultAvatar from '../assets/defaultAvatar1.jpg';
import DeleteModal from '../components/modals/DeleteModal';
import ViewUserDetailModal from '../components/modals/ViewUserDetailModal';
import NoData from '../components/NoData';
import LoadingSpin from '../components/LoadingSpin';
import Error from '../components/Error';

const ShowusersToAdmin = () => {
  const { user } = useAuthStore();

  // users
  const [users, setAllusers] = useState([]);
  const [userId, setUserId] = useState('');

  // Page state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // Searching
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('all');

  // Single User details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [isUserVerified, setUserVerified] = useState(false);
  const [role, setRole] = useState('user');

  // Modal
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        getSearchResults();
      } else {
        fetchAllusers();
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [searchTerm, filterField, pageNumber]);

  const getUserDetails = async (userId) => {
    try {
      setUserId(userId);
      setLoading(true);
      setError('');
      const response = await api.post(
        '/admin/userDetail',
        {
          userId: userId,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      setEmail(response.data.user.email);
      setFirstName(response.data.user.firstName);
      setLastName(response.data.user.lastName);
      setAvatar(response.data.user.avatar);
      setUserVerified(response.data.user.isVerified);
      setRole(response.data.user.role);
    } catch (error) {
      // console.log('Error while fetching user details', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setUserId(userId);
    try {
      const response = await api.post(
        '/admin/deleteUser',
        {
          deleteUserId: userId,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      // console.log(response);
      await fetchAllusers();
    } catch (error) {
      // console.log('Error while deleting user', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(userId);
    } catch (error) {
      // console.log(error);
    } finally {
      setDeleteModalOpen(false);
      setUserId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setUserId(null);
  };

  const fetchAllusers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page: pageNumber,
        contactLimit: limit,
        field: filterField,
      };
      const response = await api.get('/admin/getAllusers', { params });

      setAllusers(response.data.users);
      setTotalPages(response.data?.totalPages);

      // console.log(response);
    } catch (error) {
      // console.log('Error while fetching all users', error);
      setAllusers([]);
      setTotalPages(0);
      toast.error(error?.message || 'Internal server error', {
        position: 'top-center',
        theme: 'colored',
        autoClose: 3000,
      });
      setError(
        error?.message ||
          error?.response?.data.message ||
          'Internal server error',
      );
    } finally {
      setLoading(false);
    }
  };

  // Get search results
  const getSearchResults = async () => {
    try {
      setLoading(true);
      setAllusers([]);
      if (!searchTerm.trim()) {
        setLoading(false);
        return;
      }
      const params = {
        page: pageNumber,
        limit: limit,
        search: searchTerm,
        field: filterField,
      };

      const response = await api.get('/admin/search', {
        params: params,
      });

      // console.log(response);

      if (response.status === 200) {
        setAllusers(response.data.users);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      // console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && totalPages >= page) {
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

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      <div className="h-full w-full bg-gray-100">
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center justify-around p-4">
            <h1 className="text-4xl text-fuchsia-950">Users</h1>
            <div className="flex-1 max-w-4xl mx-8">
              <div className="bg-white rounded-full shadow-md">
                <div className="flex items-center px-4 py-3 gap-4">
                  <div className="flex-1 flex items-center">
                    <FiSearch className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setPageNumber(1);
                        setSearchTerm(e.target.value);
                      }}
                      placeholder="Search by name, email, or phone..."
                      className="flex-1 focus:outline-none min-w-0"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    {searchTerm && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSearchTerm('')}
                          className="text-gray-400 hover:text-gray-800 mr-3 transition-all cursor-pointer"
                        >
                          <MdClear />
                        </button>
                      </div>
                    )}
                    <select
                      value={filterField}
                      onChange={(e) => setFilterField(e.target.value)}
                      className="rounded px-3 py-2 bg-white"
                    >
                      <option value="all">All</option>
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 inset-shadow-fuchshia-600/80 rounded-xl inset-shadow-sm flex items-center justify-center">
            <div className=" h-full w-full flex flex-col items-center justify-between">
              {loading && (
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <LoadingSpin />
                </div>
              )}
              {!loading && !error && users.length === 0 && (
                <NoData cause={` No user available`} />
              )}
              {error && !loading && (
                <Error refresh={fetchAllusers} error={error} />
              )}
              {/* Delete Modal */}
              {isDeleteModalOpen && (
                <DeleteModal
                  modalPurpose={`Are you sure to delete this account?`}
                  handleModalConfirm={handleConfirmDelete}
                  handleModalCancel={handleDeleteCancel}
                  onClose={() => setDeleteModalOpen(false)}
                />
              )}
              {/* View Modal */}
              {isViewModalOpen && (
                <ViewUserDetailModal
                  setViewModalOpen={setViewModalOpen}
                  avatar={avatar}
                  defaultAvatar={defaultAvatar}
                  firstName={firstName}
                  lastName={lastName}
                  role={role}
                  email={email}
                />
              )}{' '}
              {!loading && users.length > 0 && (
                <div className="bg-white max-w-5xl w-full  rounded-lg shadow-md overflow-hidden mt-4">
                  <div className="max-h-125 overflow-y-auto hide-scrollbar ">
                    <table className="min-w-full divide-y divide-gray-300 ">
                      <thead className="bg-fuchsia-50  z-10">
                        <tr className="text-left">
                          <th className="font-medium text-xs text-gray-500 px-6 py-3">
                            AVATAR
                          </th>
                          <th className="font-medium text-xs text-gray-500 px-6 py-3">
                            NAME
                          </th>
                          <th className="font-medium text-xs text-gray-500 px-6 py-3">
                            EMAIL
                          </th>
                          <th className="font-medium text-xs text-gray-500">
                            ROLE
                          </th>
                          <th className="font-medium text-xs text-gray-500 px-4 py-3">
                            ACTION
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-gray-50/20, overflow-y-scroll">
                        {users.map((userFromBackend) => {
                          if (userFromBackend.role === 'admin') {
                            return;
                          }
                          return (
                            <tr key={userFromBackend._id}>
                              <td className="flex items-center p-6">
                                <img
                                  src={userFromBackend.avatar || defaultAvatar}
                                  alt="avatar"
                                  className="w-10 h-10 rounded-full "
                                />
                              </td>
                              <td>
                                {userFromBackend.firstName}{' '}
                                {userFromBackend.lastName}
                              </td>
                              <td>{userFromBackend.email}</td>
                              <td>
                                {userFromBackend.role === 'admin' ? (
                                  <p className="text-red-500 text-xs font-semibold">
                                    ADMIN
                                  </p>
                                ) : (
                                  <p className="text-green-500 text-xs font-semibold">
                                    USER
                                  </p>
                                )}
                              </td>
                              <td>
                                <button
                                  onClick={() => {
                                    setViewModalOpen(true);
                                    getUserDetails(userFromBackend._id);
                                  }}
                                  className=" px-2  whitespace-nowrap text-sm text-blue-500 hover:underline cursor-pointer"
                                  title="View Profile"
                                >
                                  {isViewModalOpen &&
                                  userId === userFromBackend._id ? (
                                    <GrFormView className="w-5 h-5" />
                                  ) : (
                                    <GrFormViewHide className="w-5 h-5" />
                                  )}
                                </button>
                                <button
                                  disabled={userFromBackend._id === user._id}
                                  onClick={() => {
                                    setUserId(userFromBackend._id);
                                    setDeleteModalOpen(true);
                                  }}
                                  className="px-2 whitespace-nowrap text-sm text-red-500 hover:underline cursor-pointer
                          disabled:cursor-not-allowed
                          disabled:opacity-50"
                                  title="Delete user"
                                >
                                  <MdOutlineDelete className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
      </div>
    </>
  );
};

export default ShowusersToAdmin;
