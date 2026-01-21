import React, { useEffect, useState } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdClear } from 'react-icons/md';
import { GrFormView } from 'react-icons/gr';
import { GrFormViewHide } from 'react-icons/gr';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineModeEditOutline,
} from 'react-icons/md';
import api from '../api/axios';
import ContactViewModal from '../components/modals/ContactViewModal';
import ContactEditModal from '../components/modals/ContactEditModal';
import AddNewContactModal from '../components/modals/AddNewContactModal';
import { toast, ToastContainer } from 'react-toastify';

const Contact = () => {
  // All Contacts
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');

  // Loading State
  const [loading, setLoading] = useState(true);

  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);

  // Searching
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');

  //Modal
  const [isAddContactModal, setAddContactModal] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);

  // Contact details
  const [contactId, setContactId] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAge, setContactAge] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        getSearchResults();
      } else {
        getContacts();
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [searchTerm, searchField, pageNumber]);

  // Page contact limit
  const limit = 5;

  // Single contact detail
  const getContactDetail = async (contactId) => {
    setContactId(contactId);
    try {
      const params = {
        contactId: contactId,
      };
      const response = await api.get('/contact/getContact', {
        params: params,
      });

      // console.log(response);

      setContactEmail(response.data.contact.email);
      setContactName(response.data.contact.name);
      setContactPhone(response.data.contact.phone);
      setContactAge(response.data.contact.age);
    } catch (error) {
      console.error(error);
    }
  };

  // Get all contacts in array
  const getContacts = async () => {
    try {
      setContacts([]);
      setLoading(true);
      setError('');
      const params = {
        page: pageNumber,
        limit: limit,
        field: searchField,
      };

      const response = await api.get('/contact', {
        params: params,
      });
      // console.log(response);

      if (response.status === 200) {
        setContacts(response.data.contacts);
        setTotalPages(response.data.totalPages);
        setTotalContacts(response.data.totalContacts);
      } else {
        setError('Failed to load contacts');
      }
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
          'Error occurred on server while fetching the contacts'
      );
      toast.error(
        error?.message ||
          error.response?.data?.message ||
          'Internal server error',
        {
          position: 'top-center',
          autoClose: 3000,
          theme: 'colored',
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Add new Contact
  const addContact = async (event) => {
    try {
      event.preventDefault();
      // setLoading(true);
      const response = await api.post(
        '/contact/addContact',
        {
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          age: contactAge,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      // console.log(response);

      getContacts();
      setAddContactModal(false);
      toast.success(response?.data.message || 'Contact created');
    } catch (error) {
      console.error('New Contact', error);
      toast.error(
        error?.response?.data.message ||
          error?.message ||
          'Something went wrong on creating contact',
        {
          position: 'top-center',
          theme: 'colored',
          autoClose: 3000,
        }
      );
    }
  };

  // Edit contact
  const editContact = async (event) => {
    try {
      event.preventDefault();

      const response = await api.post(
        '/contact/editContact',
        {
          contactId: contactId,
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      getContacts();
      toast.success(response.data.message, {
        position: 'top-center',
        theme: 'colored',
        autoClose: 3000,
      });
      setEditModalOpen(false);
    } catch (error) {
      console.error('Edit Contact', error);
      toast.error(
        error?.message ||
          error?.response?.data.message ||
          'Internal server error',
        {
          position: 'top-center',
          theme: 'colored',
          autoClose: 3000,
        }
      );
    }
  };

  // Get search results
  const getSearchResults = async () => {
    try {
      setLoading(true);
      if (!searchTerm.trim()) {
        setContacts([]);
        setLoading(false);
        return;
      }
      const params = {
        page: pageNumber,
        limit: limit,
        search: searchTerm,
        field: searchField,
      };

      const response = await api.get('/contact/search', {
        params: params,
      });

      // console.log(response);

      if (response.status === 200) {
        setContacts(response.data.contacts);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPageNumber(page);
    }
  };

  // Page Numbers to Display
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
            <h1 className="text-4xl text-fuchsia-950">Contacts</h1>
            <div className="flex-1 max-w-4xl mx-8 min-w-0">
              <div className="bg-white rounded-full shadow-md w-full  max-w-4xl overflow-hidden min-w-0">
                <div className="flex items-center px-4 py-3 gap-4 w-full">
                  <div className="flex-1 flex items-center w-full">
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
                    <div className="flex gap-2">
                      {searchTerm && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setPageNumber(1);
                          }}
                          className="cursor-pointer"
                        >
                          <MdClear className="text-gray-400 hover:text-gray-800 mr-3 transition-all" />
                        </button>
                      )}
                    </div>

                    {/* Search Field Selector */}
                    <select
                      value={searchField}
                      onChange={(e) => setSearchField(e.target.value)}
                      className="rounded px-3 py-2"
                    >
                      <option value="all">All</option>
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  setAddContactModal(true);
                }}
                className="px-4 py-2 bg-fuchsia-600 text-fuchsia-50 hover:bg-fuchsia-800 hover:text-white rounded-lg cursor-pointer transition-all"
              >
                Add Contact
              </button>
            </div>
          </div>

          <main className="flex-1 flex flex-col items-center w-full ">
            <div className="p-4 mb-6 max-w-3xl w-full  overflow-hidden min-w-0">
              <div className="flex justify-between items-center">
                <div className="">
                  <p className="text-gray-600">
                    {searchTerm ? (
                      <>
                        Showing{' '}
                        <span className="font-bold">{contacts.length}</span>{' '}
                        search results for "
                        <span className="font-bold">{searchTerm}</span>"
                      </>
                    ) : (
                      <>
                        Showing{' '}
                        <span className="font-bold">{contacts.length}</span> of{' '}
                        <span className="font-bold">{totalContacts}</span>{' '}
                        contacts
                      </>
                    )}
                  </p>
                </div>
                <div className="text-gray-600">
                  Page <span className="font-bold">{pageNumber}</span> of{' '}
                  <span className="font-bold">{totalPages}</span>
                </div>
              </div>
            </div>

            {/* Contacts*/}

            <div className="relative max-w-5xl h-full w-full flex flex-col items-center justify-center">
              {loading && (
                <div className="flex items-center justify-center h-12 w-12 rounded-full border-4 border-fuchsia-300  border-b-4 border-l-4 border-t-4 border-b-fuchsia-700 border-l-fuchsia-700 border-t-fuchsia-700 animate-spin"></div>
              )}

              {!error && !loading && contacts.length === 0 && (
                <div className="flex items-center justify-center bg-gray-300 px-20 py-10 rounded-md min-w-0 border">
                  No contacts available
                </div>
              )}

              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                  <p className="text-red-600 font-semibold">Error: {error}</p>
                  <button
                    onClick={getContacts}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!loading && contacts.length > 0 && (
                <div className="bg-white max-w-5xl w-full  rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-fuchsia-50/70">
                      <tr className="text-left">
                        <th className="font-medium text-xs text-gray-500 px-6 py-3">
                          NAME
                        </th>
                        <th className="font-medium text-xs text-gray-500 px-6 py-3">
                          EMAIL
                        </th>
                        <th className="font-medium text-xs text-gray-500 px-6 py-3">
                          PHONE
                        </th>
                        <th className="font-medium text-xs text-gray-500 px-2 py-3">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-fuchsia-50/20">
                      {contacts.map((contact) => (
                        <tr key={contact._id} className="hover:bg-gray-50">
                          <td className="p-6">{contact.name}</td>
                          <td className="p-6">{contact.email}</td>
                          <td className="p-6">{contact.phone}</td>
                          <td>
                            <button
                              onClick={() => {
                                setViewModalOpen(true);
                                getContactDetail(contact._id);
                              }}
                              className=" px-2  whitespace-nowrap text-sm text-blue-500 hover:underline cursor-pointer"
                            >
                              {isViewModalOpen && contactId === contact._id ? (
                                <GrFormView className="h-5 w-5" />
                              ) : (
                                <GrFormViewHide className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setEditModalOpen(true);
                                getContactDetail(contact._id);
                              }}
                              className="px-2 whitespace-nowrap text-sm text-red-500 hover:underline cursor-pointer"
                            >
                              <MdOutlineModeEditOutline className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {loading && contacts.length !== 0 && (
                <div className="flex items-center justify-center h-12 w-12 rounded-full border-4 border-fuchsia-300  border-b-4 border-l-4 border-t-4 border-b-fuchsia-700 border-l-fuchsia-700 border-t-fuchsia-700 animate-spin"></div>
              )}
            </div>

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="p-6  max-w-3xl w-full  overflow-hidden min-w-0">
                <div className="flex justify-around items-center gap-4">
                  {/* First & Previous */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => goToPage(1)}
                      disabled={pageNumber === 1}
                      className="p-2 cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 disabled:hover:bg-gray-100 rounded-full "
                      title="Go to first Page"
                    >
                      <MdKeyboardDoubleArrowLeft />
                    </button>
                  </div>
                  <div className="flex  gap-2">
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
                            className={`w-10 h-10  rounded-full mx-1 cursor-pointer ${
                              pageNumber === page
                                ? 'bg-fuchsia-600 text-white'
                                : ' hover:bg-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                  </div>

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
          </main>

          {/* Add new Contact Modal */}
          {isAddContactModal && (
            <AddNewContactModal
              isOpen={isAddContactModal}
              onClose={() => setAddContactModal(false)}
              onSave={addContact}
              setContactAge={setContactAge}
              setContactName={setContactName}
              setContactEmail={setContactEmail}
              setContactPhone={setContactPhone}
            />
          )}

          {/* Edit Modal */}
          {isEditModalOpen && (
            <ContactEditModal
              isOpen={isEditModalOpen}
              onClose={() => setEditModalOpen(false)}
              contactName={contactName}
              setContactName={setContactName}
              contactEmail={contactEmail}
              setContactEmail={setContactEmail}
              contactPhone={contactPhone}
              setContactPhone={setContactPhone}
              onSave={editContact}
            />
          )}

          {/* View Modal */}

          {isViewModalOpen && (
            <ContactViewModal
              isOpen={isViewModalOpen}
              onClose={() => setViewModalOpen(false)}
              name={contactName}
              email={contactEmail}
              phone={contactPhone}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Contact;
