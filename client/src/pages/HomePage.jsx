import React, { useState } from 'react';
import RightSideBar from '../components/RightSidebar';
import ChatContainer from '../components/ChatContainer';
import Sidebar from '../components/Sidebar';

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null); // use null instead of false for clarity

  return (
    <div className="w-full h-screen border sm:px-[15%] sm:py-[5%]">
      <div className="backdrop-blur-xl border h-full border-gray-600 rounded-2xl overflow-hidden grid grid-cols-16 relative">
        <Sidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <ChatContainer selectedUser={selectedUser} />
        <RightSideBar selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default HomePage;