import React from 'react';
import { FaCheck } from 'react-icons/fa';

import pdfPNG from '../assets/pdf.png';
import cssPNG from '../assets/css.png';
import spreadSheetPNG from '../assets/spreadsheet.png';
import jsonPNG from '../assets/json.png';
import jsPNG from '../assets/javascript.png';
import htmlPNG from '../assets/html.png';
import markdownPNG from '../assets/markdown.png';
import docxPNG from '../assets/document.png';
import txtPNG from '../assets/txt.png';
import audioPNG from '../assets/audio.png';
import { FaPlay } from 'react-icons/fa6';

const GroupPageDocuments = ({
  isSelectionOpen,
  isCurrentUser,
  user,
  selectedDocsIds,
  setSelectedDocsIds,
  item,
}) => {
  return (
    <div className="bg-black/10 backdrop-blur-2xl rounded-lg shadow-2xl/10 p-4 flex flex-col items-center overflow-hidden relative">
      {isSelectionOpen && (isCurrentUser || user.role === 'admin') && (
        <div
          onClick={() => {
            selectedDocsIds.includes(item._id)
              ? setSelectedDocsIds((prev) =>
                  prev.filter((id) => id !== item._id),
                )
              : setSelectedDocsIds((prev) => [...prev, item._id]);
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
            src={item.thumbnail}
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
          <img src={txtPNG} alt="document" className="w-20 h-20 object-cover" />
        )}
        {item.fileExt === '.html' && (
          <img src={htmlPNG} alt="html" className="w-20 h-20 object-cover" />
        )}
        {item.fileExt === '.css' && (
          <img src={cssPNG} alt="css" className="w-20 h-20 object-cover" />
        )}
        {item.fileExt === '.js' && (
          <img src={jsPNG} alt="pdf" className="w-20 h-20 object-cover" />
        )}
        {item.fileExt === '.json' && (
          <img src={jsonPNG} alt="pdf" className="w-20 h-20 object-cover" />
        )}
        {item.fileExt === '.md' && (
          <img src={markdownPNG} alt="pdf" className="w-20 h-20 object-cover" />
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
        {item.fileExt === '.mp3' && (
          <img src={audioPNG} alt="audio" className="w-20 h-20 object-cover" />
        )}
        {item.fileExt === '.mp4' && (
          <div className="relative ">
            <img
              src={item.thumbnail}
              alt="video"
              className="w-25 h-20 object-cover rounded-sm"
            />
            <div
              className="absolute inset-0 flex items-center justify-center hover:bg-black/60  text-fuchsia-700
                                  hover:text-white transition-all rounded-sm"
            >
              <FaPlay className="w-6 h-6" />
            </div>
          </div>
        )}

        <span className="text-sm truncate max-w-26">{item.fileName}</span>

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
  );
};

export default GroupPageDocuments;
