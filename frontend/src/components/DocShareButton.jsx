import { MdAttachFile } from 'react-icons/md';

const DocShareButton = ({ handleFile }) => {
  const onChange = async (event) => {
    await handleFile(event);
    return;
  };
  return (
    <>
      <label
        htmlFor="document"
        className=" border-fuchsia-500 text-fuchsia-600 p-4 flex items-center justify-between gap-1 rounded-full  cursor-pointer hover:border-fuchsia-700 hover:text-fuchsia-800 transition-all"
        title="Share Document"
      >
        <span className="">Upload</span>
        <MdAttachFile className="w-5 h-5" />
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
    </>
  );
};

export default DocShareButton;
