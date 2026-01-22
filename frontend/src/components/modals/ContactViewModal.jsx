import { IoClose } from 'react-icons/io5';

const ContactViewModal = ({ isOpen, onClose, name, email, phone }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={() => onClose()}
        className="absolute inset-0 bg-black/50"
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg py-10 px-8 w-full max-w-md flex flex-col items-center gap-8">
        <div
          onClick={onClose}
          className="absolute -top-5 -right-5 bg-fuchsia-50 hover:bg-fuchsia-100 transition-all p-2 rounded-full cursor-pointer"
        >
          <IoClose className="w-6 h-6" />
        </div>
        <h2 className="text-5xl text-fuchsia-950">{name}</h2>
        <div className=" w-full rounded-sm overflow-hidden">
          <div className="bg-fuchsia-950/30 backdrop-blur-2xl border-l-4 border-l-fuchsia-800 p-6 flex items-center gap-4">
            <span className="font-semibold ">Email:</span>
            <span>{email}</span>
          </div>
        </div>
        <div className=" w-full rounded-sm overflow-hidden">
          <div className="bg-fuchsia-950/30 backdrop-blur-2xl border-l-4 border-l-fuchsia-800 p-6 flex items-center gap-4">
            <span className="font-semibold ">Phone:</span>
            <span>{phone}</span>
          </div>
        </div>
        <button
          onClick={() => onClose()}
          className="w-fit border-2 bg-fuchsia-600 px-12 py-2 text-fuchsia-50 rounded-lg cursor-pointer hover:bg-fuchsia-800"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ContactViewModal;
