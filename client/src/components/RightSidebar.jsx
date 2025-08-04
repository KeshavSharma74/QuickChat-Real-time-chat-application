import React, { useContext } from 'react';
// Make sure the path to your assets file is correct
import assets, { imagesDummyData } from '../assets/assets';
import AuthContext from '../context/authContext';

const RightSideBar = ({ selectedUser }) => {
  // If no user is selected, don't render the component
  const { logout } = useContext(AuthContext);
  if (!selectedUser) {
    return null;
  }

  return (
    // Added 'col-span-4' to fix the layout
    <div className={`col-span-4 bg-[#818582]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}>
      
      {/* User Info Section */}
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt='User Profile' className='w-20 aspect-[1/1] rounded-full' />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          <p className='w-2 h-2 rounded-full bg-green-500'></p>
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>

      <hr className='border-[#ffffff50] my-4' />

      {/* Media Section */}
      <div className='px-5 text-xs pb-20'> {/* Added bottom padding to prevent overlap with button */}
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {imagesDummyData.map((url, index) => (
            <div key={index} onClick={() => window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt={`shared-media-${index}`} className='h-full w-full object-cover rounded-md' />
            </div>
          ))}
        </div>
      </div>
      
      {/* Centered Logout Button */}
      <button onClick={ logout } className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
          Logout
      </button>

    </div>
  );
};

export default RightSideBar;