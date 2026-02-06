import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

const Pagination = ({ pageNumber, setPageNumber, totalPages }) => {
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
  return (
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
            className="p-2 cursor-pointer  disabled:opacity-50 disabled:cursor-not-allo wed hover:bg-gray-200 disabled:hover:bg-gray-100 rounded-full "
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
  );
};

export default Pagination;
