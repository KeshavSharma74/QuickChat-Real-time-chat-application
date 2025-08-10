import React, { useContext, useState, useEffect } from 'react';
import assets from '../assets/assets';
import AuthContext from '../context/authContext';
import ChatContext from '../context/ChatContext';

const RightSideBar = () => {
  const { logout, onlineUsers } = useContext(AuthContext);
  const { selectedUser, messages } = useContext(ChatContext);
  const [sharedMedia, setSharedMedia] = useState([]);

  // Extract shared images from messages
  useEffect(() => {
    if (messages && messages.length > 0) {
      const mediaMessages = messages.filter(msg => msg.image);
      setSharedMedia(mediaMessages);
    } else {
      setSharedMedia([]);
    }
  }, [messages]);

  // If no user is selected, don't render the component
  if (!selectedUser) {
    return null;
  }

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className={`col-span-4 bg-[#818582]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}>
      
      {/* User Info Section */}
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <div className="relative">
          <img 
            src={selectedUser.profilePic || assets.avatar_icon} 
            alt='User Profile' 
            className='w-20 aspect-[1/1] rounded-full object-cover' 
          />
          {isOnline && (
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#818582]"></div>
          )}
        </div>
        
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          <p className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></p>
          {selectedUser.fullName}
        </h1>
        
        <p className='px-10 mx-auto text-center text-gray-300'>
          {selectedUser.bio || "No bio available"}
        </p>
        
        <p className={`text-xs ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>

      <hr className='border-[#ffffff50] my-4' />

      {/* User Details Section */}
      <div className='px-5 text-xs mb-4'>
        <p className="text-gray-300 mb-2">User Info</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Email:</span>
            <span className="text-white">{selectedUser.email || 'Not available'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status:</span>
            <span className={isOnline ? 'text-green-400' : 'text-gray-400'}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <hr className='border-[#ffffff50] my-4' />

      {/* Media Section */}
      <div className='px-5 text-xs pb-20'>
        <p className="text-gray-300 mb-2">Shared Media ({sharedMedia.length})</p>
        
        {sharedMedia.length > 0 ? (
          <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
            {sharedMedia.map((mediaMsg, index) => (
              <div 
                key={mediaMsg._id || index} 
                onClick={() => window.open(mediaMsg.image)} 
                className='cursor-pointer rounded hover:opacity-100 transition-opacity'
              >
                <img 
                  src={mediaMsg.image} 
                  alt={`shared-media-${index}`} 
                  className='h-20 w-full object-cover rounded-md' 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-4">
            <p>No media shared yet</p>
          </div>
        )}
      </div>
      
      {/* Centered Logout Button */}
      <button 
        onClick={logout} 
        className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer hover:from-purple-500 hover:to-violet-700 transition-all'
      >
        Logout
      </button>

    </div>
  );
};

export default RightSideBar;