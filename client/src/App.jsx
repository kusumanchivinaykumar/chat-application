import React, { useContext, useEffect } from 'react'
import {AuthContext} from '../context/AuthContextObject.js'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import AOS from 'aos';
import 'aos/dist/aos.css';
import {Toaster} from 'react-hot-toast'

const App = () => {
  const {authUser, isCheckingAuth} = useContext(AuthContext)
    useEffect(() => {
    AOS.init({
      duration: 1000,   // animation time (ms)
      once: true,       // animation only once
      easing: 'ease-in-out'
    });
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f0c29] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-[#0f0c29]">
     <Toaster/>
      <Routes>
        <Route path='/' element={authUser?<Home/>:<Navigate to="/login"/>}/>
        <Route path='/login' element={!authUser?<Login/>:<Navigate to="/"/>}/>
        <Route path='/profile' element={authUser?<Profile/>:<Navigate to="/login"/>}/>
      </Routes>
    </div>
  )
}

export default App
