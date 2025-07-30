import React, { useState } from 'react'
import assets from '../assets/assets'

const LoginPage = () => {

  const [currentState,setCurrentState]=useState("signup");
  const [dataSubmitted,setDataSumitted]=useState(false);


  // setCurrentState("signup");
  const changeState=()=>{
    (currentState==="signup"? setCurrentState("login"):setCurrentState("signup"));
  }

  return (
    <div className='flex backdrop-blur-[2rem] h-[100vh]'>



        {/* leftbox */}
        <div className='w-[50%] relative left-20 flex justify-center items-center'>
            <img src={assets.logo_big} className='w-[16.5rem]' alt="" />
        </div>

        {/* rightbox */}
        <div className='w-[50%]  flex items-center justify-center'>
          <div className='relative bg-white/7 right-20 flex flex-col border-gray-600 border-[0.11rem] px-7 py-5 gap-5 rounded-xl'>
              <h1 className='text-white text-[2rem]'> {currentState=="signup"?'Sign up':'Login'} </h1>
              {
              (currentState==="signup" && <input type="text" placeholder='Full Name' className='p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 focus:border-2 placeholder-gray-400 text-white' />)
                }
              
              <input type="email" placeholder='Email Address' className=' p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 focus:border-2placeholder-gray-400 text-white' />
              <input type="password" placeholder='Password' className='p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 focus:border-2 placeholder-gray-400 text-white' />
              <button className='bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-lg font-light py-2 px-20 rounded-lg cursor-pointer'> {currentState==="signup"? "Create Account" : "Login Now"}  </button>
              <div className='flex gap-1'>
                <input type="checkbox" className='hover:cursor-pointer' name="" id="" />
                <p className='text-gray-400 text-sm '>Agree to the terms of use & privacy policy.</p>
              </div>
             <p className='text-gray-400 text-sm mb-3'> {currentState==="signup"?"Already have an account? ": "Create an Account"}  <span className='text-violet-500 text-sm font-bold hover:cursor-pointer' onClick={changeState} > {currentState==="login"?"Click Here":"Login Here"}</span> </p>

          </div>
        </div>
    </div>
  )
}

export default LoginPage