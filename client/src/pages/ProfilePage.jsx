import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("Martin Johnson");
  const [bio, setBio] = useState("Hi Everyone, I am Using QuickChat");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form is valid here if it reached this point
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center backdrop-blur-[2rem] rounded-2xl overflow-hidden">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse p-5 rounded-lg">

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 flex-1">
          <h3 className="text-2xl font-bold text-white">Profile details</h3>

          {/* Avatar Upload */}
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              alt="avatar"
              className={`w-12 h-12 rounded-full ${selectedImg && 'border-2 border-purple-400'}`}
            />
            <span className="text-sm text-gray-400">Upload profile image</span>
          </label>

          {/* Name Input */}
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* Bio Textarea */}
          <textarea
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write profile bio"
            className="p-2 border border-gray-500 rounded-md text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
          ></textarea>

          {/* Save Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>

        {/* Right side Logo */}
        <img
          src={assets.logo_icon}
          alt=""
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
