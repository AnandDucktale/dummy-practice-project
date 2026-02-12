import React from 'react';
import { FaPlay } from 'react-icons/fa6';

import cssPNG from '../assets/css.png';
import spreadSheetPNG from '../assets/spreadsheet.png';
import jsonPNG from '../assets/json.png';
import jsPNG from '../assets/javascript.png';
import htmlPNG from '../assets/html.png';
import markdownPNG from '../assets/markdown.png';
import docxPNG from '../assets/document.png';
import txtPNG from '../assets/txt.png';
import audioPNG from '../assets/audio.png';

const Documents = ({ document }) => {
  return (
    <a
      href={document.documentUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-2 items-center w-30 h-30 overflow-hidden"
      title={document.fileName}
    >
      {document.type.includes('application/pdf') && (
        <img src={document.thumbnail} alt="pdf" className=" object-cover" />
      )}
      {document.type.includes(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ) && (
        <img
          src={spreadSheetPNG}
          alt="spreadsheet"
          className="w-30 h-30 object-cover"
        />
      )}
      {document.type.includes(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ) && (
        <img src={docxPNG} alt="document" className="w-30 h-30 object-cover" />
      )}
      {document.type.includes('application/msword') && (
        <img src={docxPNG} alt="document" className="w-30 h-30 object-cover" />
      )}
      {document.type.includes('text/plain') && (
        <img src={txtPNG} alt="document" className="w-30 h-30 object-cover" />
      )}
      {document.type.includes('text/html') && (
        <img src={htmlPNG} alt="html" className="w-30 h-30 object-cover" />
      )}
      {document.type.includes('text/css') && (
        <img src={cssPNG} alt="css" className="w-30 h-30 object-cover" />
      )}
      {document.type.includes('text/javascript') && (
        <img src={jsPNG} alt="pdf" className="w-30 h-30 object-cover" />
      )}
      {document.type.includes('text/json') && (
        <img src={jsonPNG} alt="pdf" className="w-30 h-30 object-cover" />
      )}
      {document.type.includes('text/markdown') && (
        <img src={markdownPNG} alt="pdf" className="w-30 h-30 object-cover" />
      )}
      {document.type.includes('image/') && (
        <img
          src={document.documentUrl}
          alt="img"
          className="w-30 h-30 object-cover"
        />
      )}
      {document.type.includes('audio/') && (
        <img src={audioPNG} alt="audio" className="w-30 h-30 object-cover" />
      )}
      {document.type.includes('video/') && (
        <div className="relative ">
          <img
            src={document.thumbnail}
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
    </a>
  );
};

export default Documents;
