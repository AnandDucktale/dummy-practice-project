import React from 'react';
import { FaShare } from 'react-icons/fa';

const DocShareButton = ({ handleFileSelection }) => {
  const onChange = async (event) => {
    await handleFileSelection(event);
    return;
  };
  return (
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
        onChange={onChange}
        accept="image/jpeg, image/jpg, image/png, image/webp, video/mp4, audio/mp3,text/plain,text/html, 	application/msword, text/css, text/javascript, text/json, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf, text/markdown, application/vnd.ms-excel"
        multiple
      />
    </div>
  );
};

export default DocShareButton;
