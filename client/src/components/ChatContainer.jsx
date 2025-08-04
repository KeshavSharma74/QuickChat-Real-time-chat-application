import React, { useEffect, useRef } from 'react';
import assets, { messagesDummyData } from '../assets/assets';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = ({ selectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesDummyData]);

  return (
    <div
      className={`backdrop-blur-xl border-l border-gray-600 h-full overflow-hidden ${
        selectedUser ? 'col-span-8' : 'col-span-8'
      }`}
    >
      {selectedUser ? (
        <div className="flex flex-col h-full">
          {/* ---------- HEADER ---------- */}
          <div className="flex p-4 justify-between items-center">
            <div className="flex gap-2 items-center">
              <img
                src={selectedUser?.profilePic || assets.avatar_icon}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white font-medium">{selectedUser.fullName}</span>
              <span className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <img src={assets.help_icon} alt="help" className="w-5 h-5" />
          </div>

          <hr className="mx-4 border border-gray-600" />

          {/* ---------- MESSAGES ---------- */}
          <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
            {messagesDummyData.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 justify-end ${
                  msg.senderId !== '680f50e4f10f3cd28382ecf9' ? 'flex-row-reverse' : ''
                }`}
              >
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="message"
                    className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                  />
                ) : (
                  <p
                    className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                      msg.senderId === '680f50e4f10f3cd28382ecf9'
                        ? 'rounded-br-none'
                        : 'rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </p>
                )}

                <div className="text-center text-xs">
                  <img
                    src={
                      msg.senderId === '680f50e4f10f3cd28382ecf9'
                        ? assets.profile_martin
                        : assets.avatar_icon
                    }
                    alt="avatar"
                    className="w-7 rounded-full"
                  />
                  <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
                </div>
              </div>
            ))}
            <div ref={scrollEnd}></div>
          </div>

          {/* ---------- BOTTOM INPUT AREA ---------- */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
            <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
              <input
                type="text"
                placeholder="Send a message"
                className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
              />
              <input type="file" id="image" accept="image/png, image/jpeg" hidden />
              <label htmlFor="image">
                <img
                  src={assets.gallery_icon}
                  alt=""
                  className="w-5 mr-2 cursor-pointer"
                />
              </label>
            </div>
            <img
              src={assets.send_button}
              alt=""
              className="w-7 cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <div className="bg-white/10 h-full flex flex-col justify-center items-center text-gray-500 max-md:hidden">
          <img src={assets.logo_icon} className="max-w-16" alt="" />
          <span className="text-white text-[1.5rem] font-medium">Chat Anytime, anywhere</span>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;