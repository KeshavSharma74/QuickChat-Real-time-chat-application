import React, { useState } from 'react'
import assets from '../assets/assets'

const LoginPage = () => {

  const [currentState, setCurrentState] = useState("signup");
  const [dataSubmitted, setDataSumitted] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [fullName, setFullName] = useState("");

  const changeState = () => {
    setCurrentState(currentState === "signup" ? "login" : "signup");
    setDataSumitted(false); // reset form state
  }

  const handleButton = () => {
    if (currentState === "signup") setDataSumitted(true);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your submission logic here
    console.log({
      fullName,
      email,
      password,
      bio
    });
    // After submit, you can reset form or show success
  }

  return (
    <div className='flex backdrop-blur-[2rem] h-[100vh]'>

      {/* Left Box */}
      <div className='w-[50%] relative left-20 flex justify-center items-center'>
        <img src={assets.logo_big} className='w-[16.5rem]' alt="" />
      </div>

      {/* Right Box */}
      <div className='w-[50%] flex items-center justify-center'>
        <form onSubmit={handleSubmit} className='relative bg-white/7 right-20 flex flex-col border-gray-600 border-[0.11rem] px-7 py-5 gap-5 rounded-xl'>

          <h1 className='text-white text-[2rem]'>
            {currentState === "signup" ? 'Sign up' : 'Login'}
          </h1>

          {/* Full Name */}
          {
            currentState === "signup" && !dataSubmitted &&
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder='Full Name'
              className='p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 focus:border-2 placeholder-gray-400 text-white'
            />
          }

          {/* Email */}
          {
            !dataSubmitted &&
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email Address'
              className='p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 focus:border-2 placeholder-gray-400 text-white'
            />
          }

          {/* Password */}
          {
            !dataSubmitted &&
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className='p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 focus:border-2 placeholder-gray-400 text-white'
            />
          }

          {/* Bio */}
          {
            currentState === "signup" && dataSubmitted &&
            <textarea
              rows={4}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder='Provide a short bio...'
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-white'
            ></textarea>
          }

          {/* Button */}
          <button
            type="submit"
            onClick={handleButton}
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-lg font-light py-2 px-20 rounded-lg cursor-pointer'
          >
            {currentState === "signup" ? "Create Account" : "Login Now"}
          </button>

          {/* Checkbox */}
          <div className='flex gap-1'>
            <input type="checkbox" className='hover:cursor-pointer' required />
            <p className='text-gray-400 text-sm'>Agree to the terms of use & privacy policy.</p>
          </div>

          {/* Switch */}
          <p className='text-gray-400 text-sm mb-3'>
            {currentState === "signup" ? "Already have an account? " : "Create an Account "}
            <span className='text-violet-500 text-sm font-bold hover:cursor-pointer' onClick={changeState}>
              {currentState === "login" ? "Click Here" : "Login Here"}
            </span>
          </p>

        </form>
      </div>
    </div>
  )
}

export default LoginPage
