import React from 'react';
import { IoIosSend } from 'react-icons/io';
import { MdAttachFile } from 'react-icons/md';
import DocShareButton from './DocShareButton';
import Documents from './Documents';
import NoData from './NoData';
import LoadingSpin from './LoadingSpin';

const GroupMessages = ({
  loading,
  // error,
  chatRef,
  messages,
  user,
  handleFile,
  textMessage,
  setTextMessage,
  handleSendTextMessage,
  handleChatUpperScroll,
}) => {
  return (
    <div className="relative  w-full h-full isolate">
      <div
        className="absolute -top-90 -right-80 h-200 w-200 rounded-full 
    bg-[radial-gradient(circle,rgba(255,27,145,0.2)_0%,transparent_60%)] -z-10"
      />
      <div
        className="absolute -top-30 -left-90 h-200 w-200 rounded-full 
    bg-[radial-gradient(circle,rgba(67,39,245,0.2)_0%,transparent_60%)] -z-10"
      />
      <div
        className="absolute -bottom-64 -left-20 h-94 w-94 rounded-full
    bg-[radial-gradient(circle,rgba(224,113,38,0.4)_0%,transparent_60%)] -z-10"
      />{' '}
      <div
        className="absolute bottom-14 -right-10 h-94 w-94 rounded-full
    bg-[radial-gradient(circle,rgba(224,113,38,0.2)_0%,transparent_60%)] -z-10"
      />{' '}
      <ul
        ref={chatRef}
        onScroll={handleChatUpperScroll}
        className="h-3/4 px-10 overflow-y-scroll hide-scrollbar flex flex-col "
      >
        {' '}
        {loading && (
          <div className="w-full h-50 flex items-center justify-center">
            {loading}
            <LoadingSpin />
          </div>
        )}
        {messages.length > 0 &&
          messages.map((message) => {
            return message.senderId._id !== user._id ? (
              <li key={message._id} className=" w-full">
                {message.messageType === 'text' && (
                  <div className="">
                    <div className=" w-2/3 p-4">
                      <div className="w-fit flex flex-col gap-2">
                        <div className="bg-gray-300 p-2 rounded-t-lg rounded-br-lg relative ml-1 w-fit">
                          <div className="absolute w-2 h-2 bg-gray-300 -bottom-1 left-0 rounded-tr-sm rounded-bl-sm rotate-45"></div>
                          {message.data}
                        </div>
                        <div className="flex items-center justify-start gap-1">
                          <img
                            src={message.senderId.avatar}
                            alt=""
                            className="w-4 h-4 object-cover rounded-full"
                          />

                          <div className="text-xs">
                            Sent by{' '}
                            <span className="text-fuchsia-600">
                              {message.senderId.firstName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}{' '}
                {message.messageType === 'document' && (
                  <div className="p-4">
                    <div className="relative flex justify-start flex-col p-1 bg-gray-300 w-fit mb-2 ml-1 rounded-t-sm rounded-br-sm">
                      <div className="absolute w-2 h-2 bg-gray-300 -bottom-1 left-0 rounded-tr-sm rounded-bl-sm rotate-45"></div>
                      <Documents document={message.document} />
                      <div
                        className="w-30 truncate text-xs text-center p-2 bg-gray-200"
                        title={message?.document?.fileName}
                      >
                        {message?.document.fileName}
                      </div>
                    </div>
                    <div className="flex items-center justify-start gap-1">
                      <img
                        src={message?.senderId.avatar}
                        alt=""
                        className="w-4 h-4 object-cover rounded-full"
                      />

                      <div className="text-xs">
                        Sent by{' '}
                        <span className="text-fuchsia-600">
                          {message?.senderId.firstName}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ) : (
              <li key={message._id} className="flex justify-end w-full">
                {message.messageType === 'text' && (
                  <div className="p-4">
                    <div className="w-fit flex items-end relative text-wrap">
                      <div className="bg-gray-400 p-2 rounded-t-lg rounded-bl-lg relative mr-6 ">
                        <div className="absolute w-2 h-2 bg-gray-400 bottom-0 -right-1 rounded-tr-full "></div>
                        {message.data}
                      </div>

                      <div className="absolute -bottom-2 right-0">
                        <img
                          src={message.senderId.avatar}
                          alt=""
                          className="w-4 h-4 object-cover rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {message.messageType === 'document' && (
                  <div className=" relative p-4">
                    <div className="relative flex justify-start flex-col p-1 bg-gray-400  mr-6  rounded-sm ">
                      <div className="absolute w-2 h-2 bg-gray-400 bottom-0 -right-1 rounded-tr-full "></div>
                      <Documents document={message.document} />
                      <div
                        className="w-30 truncate text-xs text-center p-2 bg-gray-300"
                        title={message.document.fileName}
                      >
                        {message.document.fileName}
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-4 z-20 ">
                      <img
                        src={message.senderId.avatar}
                        alt=""
                        className="w-4 h-4 object-cover rounded-full"
                      />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
      </ul>
      <div className=" h-1/4 p-6 bg-emerald-200/10 backdrop-blur-3xl">
        <div className="w-full bg-gray-400/20 shadow-2xl/30 backdrop-blur-3xl h-14 rounded-full flex overflow-hidden gap-2 items-center ">
          <div className=" w-full h-full">
            {' '}
            <input
              type="text"
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              className=" w-full h-full px-6 text-gray-700/90 focus:outline-none"
              placeholder="Write a message..."
            />
          </div>
          {/* Document sharing button */}
          <DocShareButton handleFile={handleFile} />
          <div
            className="p-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-between gap-4 cursor-pointer hover:bg-fuchsia-700 transition-all"
            onClick={handleSendTextMessage}
          >
            <span className="">Send</span>
            <IoIosSend className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupMessages;
