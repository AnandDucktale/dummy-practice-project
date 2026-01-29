import React from 'react';
import { ImCross } from 'react-icons/im';

import pdfPNG from '../../assets/pdf.png';
import cssPNG from '../../assets/css.png';
import spreadSheetPNG from '../../assets/spreadsheet.png';
import jsonPNG from '../../assets/json.png';
import jsPNG from '../../assets/javascript.png';
import htmlPNG from '../../assets/html.png';
import videoPNG from '../../assets/video.png';
import audioPNG from '../../assets/audio.png';
import markdownPNG from '../../assets/markdown.png';
import docxPNG from '../../assets/document.png';
import txtPNG from '../../assets/txt.png';

const DocsPreviewModal = ({
  setDocsPreviewModalOpen,
  filePreviews,
  setFiles,
  setFilePreviews,
  handleDocumentSubmission,
}) => {
  return (
    <>
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
                        prev.filter((item) => item.name !== preview.file.name),
                      );
                      setFilePreviews((prev) =>
                        prev.filter(
                          (item) => item.file.name !== preview.file.name,
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
    </>
  );
};

export default DocsPreviewModal;
