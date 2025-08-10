import React, { useContext, useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import AuthContext from '../context/authContext';
import ChatContext from '../context/ChatContext';

const ChatContainer = () => {
  const scrollEnd = useRef();
  const [messageText, setMessageText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  
  const { authUser, onlineUsers } = useContext(AuthContext);
  const { 
    selectedUser, 
    messages, 
    sendMessages 
  } = useContext(ChatContext);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() && !selectedImage) return;
    
    const messageData = new FormData();
    if (messageText.trim()) {
      messageData.append('text', messageText);
    }
    if (selectedImage) {
      messageData.append('image', selectedImage);
    }
    
    await sendMessages(messageData);
    setMessageText('');
    setSelectedImage(null);
    
    // Reset file input
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

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
              <div className="relative">
                <img
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-400 border border-gray-800" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium">{selectedUser.fullName}</span>
                <span className={`text-xs ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <img src={assets.help_icon} alt="help" className="w-5 h-5" />
          </div>

          <hr className="mx-4 border border-gray-600" />

          {/* ---------- MESSAGES ---------- */}
          <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p>No messages yet</p>
                  <p className="text-sm mt-1">Start a conversation with {selectedUser.fullName}</p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMyMessage = msg.senderId === authUser?._id;
                
                return (
                  <div
                    key={msg._id || index}
                    className={`flex items-end gap-2 mb-4 ${
                      isMyMessage ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isMyMessage && (
                      <img
                        src={selectedUser.profilePic || assets.avatar_icon}
                        alt="avatar"
                        className="w-7 h-7 rounded-full"
                      />
                    )}
                    
                    <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                      {msg.image ? (
                        <img
                          src={msg.image}
                          alt="message"
                          className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                          onClick={() => window.open(msg.image)}
                        />
                      ) : (
                        <p
                          className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-words ${
                            isMyMessage
                              ? 'bg-violet-500/30 text-white rounded-br-none'
                              : 'bg-gray-600/30 text-white rounded-bl-none'
                          }`}
                        >
                          {msg.text}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        {formatMessageTime(msg.createdAt)}
                        {isMyMessage && (
                          <span className="ml-1">
                            {msg.seen ? '✓✓' : '✓'}
                          </span>
                        )}
                      </p>
                    </div>
                    
                    {isMyMessage && (
                      <img
                        src={authUser.profilePic || assets.avatar_icon}
                        alt="avatar"
                        className="w-7 h-7 rounded-full"
                      />
                    )}
                  </div>
                );
              })
            )}
            <div ref={scrollEnd}></div>
          </div>

          {/* ---------- BOTTOM INPUT AREA ---------- */}
          <form onSubmit={handleSendMessage} className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
            <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
              <input
                type="text"
                placeholder="Send a message"
                className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              
              {selectedImage && (
                <div className="flex items-center mr-2">
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                    Image selected
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="ml-1 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <input 
                type="file" 
                id="image" 
                accept="image/png, image/jpeg" 
                hidden 
                onChange={handleImageSelect}
              />
              <label htmlFor="image">
                <img
                  src={assets.gallery_icon}
                  alt=""
                  className="w-5 mr-2 cursor-pointer"
                />
              </label>
            </div>
            <button type="submit">
              <img
                src={assets.send_button}
                alt=""
                className="w-7 cursor-pointer"
              />
            </button>
          </form>
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