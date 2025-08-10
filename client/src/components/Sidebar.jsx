import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import ChatContext from '../context/ChatContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Always call hooks unconditionally
  const authContext = useContext(AuthContext);
  const chatContext = useContext(ChatContext);

  const { logout, onlineUsers = [] } = authContext || {};
  const {
    users,
    selectedUser,
    setSelectedUser,
    getUsers,
    unseenMessages,
    getMessages
  } = chatContext || {};

  // 🔧 Always place hooks BEFORE any return/if
  useEffect(() => {
    if (getUsers && typeof getUsers === 'function') {
      getUsers();
      console.log("all users : ",users);
    }
  }, [getUsers]);

  // Handle user selection
  const handleUserSelect = async (user) => {
    if (!user?._id || !setSelectedUser || !getMessages) return;

    try {
      setSelectedUser(user);
      await getMessages(user._id);
    } catch (error) {
      console.error('Error selecting user:', error);
    }
  };

  // Filter users
  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
        user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // If context not loaded yet
  if (!authContext || !chatContext) {
    return (
      <div className="bg-[#8185B2]/10 text-white h-full rounded-l-[0.95rem] rounded-r-lg flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-[#8185B2]/10 text-white overflow-y-scroll border-gray-600 h-full rounded-l-[0.95rem] rounded-r-lg ${
        selectedUser ? 'col-span-4' : 'col-span-8'
      }`}
    >
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-gray-500">
        <img src={assets.logo} className="max-w-[10.5rem]" alt="Logo" />
        <div className="relative group">
          <img
            src={assets.menu_icon}
            className="max-h-[1.2rem] cursor-pointer"
            alt="Menu"
          />
          <div className="w-[7.5rem] p-3 right-0 bg-[#2c285f] rounded-md border border-gray-500 absolute hidden group-hover:block z-10">
            <p
              className="text-sm mb-2 hover:cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              Edit Profile
            </p>
            <hr className="mb-2 border-gray-500" />
            <p
              className="text-sm hover:cursor-pointer"
              onClick={() => logout && logout()}
            >
              Logout
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mx-5">
        <div className="flex items-center gap-2 bg-[#2c285f] border border-gray-600 rounded-2xl px-3 py-[0.35rem]">
          <img src={assets.search_icon} className="w-4 h-4" alt="Search" />
          <input
            type="text"
            className="bg-transparent outline-none text-white text-sm w-full"
            placeholder="Search User..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex flex-col mt-5 px-5 gap-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            if (!user?._id) return null;

            const isOnline =
              Array.isArray(onlineUsers) && onlineUsers.includes(user._id);
            const unseenCount = unseenMessages[user._id] || 0;

            return (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-[#2c285f] cursor-pointer transition ${
                  selectedUser?._id === user._id ? 'bg-[#2c285f]' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={user.profilePic || assets.avatar_icon}
                    className="rounded-full w-10 h-10 object-cover"
                    alt={user.fullName || 'User'}
                  />
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#2c285f]"></div>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">
                      {user.fullName || 'Unknown User'}
                    </p>
                    {unseenCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                        {unseenCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs ${
                      isOnline ? 'text-green-400' : 'text-neutral-400'
                    }`}
                  >
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400 mt-4">
            {searchTerm ? 'No users found' : 'No conversations yet'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
