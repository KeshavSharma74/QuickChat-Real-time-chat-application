import React from 'react'
import { Routes,Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

const App = () => {
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain ">
      <Routes>
        <Route path='/' element={<HomePage></HomePage> } ></Route>
        <Route path='/login' element={<LoginPage></LoginPage>}></Route>
        <Route path='/profile' element={<ProfilePage></ProfilePage>}></Route>
      </Routes>
    </div>
  )
}

export default App