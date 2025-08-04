import React, { useContext } from 'react';
import assets, { userDummyData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
  const {logout}=useContext(AuthContext);

  return (
    <div
      className={`bg-[#8185B2]/10 text-white overflow-y-scroll border-gray-600 h-full rounded-l-[0.95rem] rounded-r-lg ${
        selectedUser ? 'col-span-4' : 'col-span-8'
      }`}
    >
      {/* Header with logo and menu */}
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
              className="text-sm hover:cursor-pointer" onClick={logout}
            >
              Logout
            </p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="mx-5">
        <div className="flex items-center gap-2 bg-[#2c285f] border border-gray-600 rounded-2xl px-3 py-[0.35rem]">
          <img src={assets.search_icon} className="w-4 h-4" alt="Search" />
          <input
            type="text"
            className="bg-transparent outline-none text-white text-sm w-full"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* User list */}
      <div className="flex flex-col mt-5 px-5 gap-2">
        {userDummyData.map((user, index) => (
          <div
            key={user._id || index}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-[#2c285f] cursor-pointer transition ${
              selectedUser?._id === user._id ? 'bg-[#2c285f]' : ''
            }`}
          >
            <img
              src={user.profilePic || assets.avatar_icon}
              className="rounded-full w-10 h-10 object-cover"
              alt={user.fullName}
            />
            <div className="flex flex-col">
              <p className="text-sm font-medium">{user.fullName}</p>
              <span
                className={`text-xs ${
                  index < 3 ? 'text-green-400' : 'text-neutral-400'
                }`}
              >
                {index < 3 ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;