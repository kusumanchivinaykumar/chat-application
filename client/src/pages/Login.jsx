import React, { useContext, useState } from 'react'
import ChatLoopLogo from '../components/ChatLoopLogo.jsx'
import { useForm } from "react-hook-form"
import { AuthContext } from '../../context/AuthContextObject.js'

const Login = () => {

  const [currentState, setCurrentState] = useState("Sign Up")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const { login } = useContext(AuthContext)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    if (currentState === 'Sign Up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }
    login(
      currentState === "Sign Up" ? "signup" : "login",
      {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        bio: data.bio
      }
    )
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#0f0c29] text-white overflow-hidden relative'>
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px]" />

      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden mx-4">
        
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-br from-violet-600/50 to-purple-800/50 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <ChatLoopLogo className='w-40 h-40 mb-6 drop-shadow-lg' />
            <h2 className="text-3xl font-bold mb-2">Welcome to ChatLoop</h2>
            <p className="text-gray-200">Connect, share, and collaborate with your team in real-time.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className='text-3xl font-bold mb-2'>{currentState}</h2>
            <p className="text-gray-400">
              {currentState === "Sign Up" 
                ? "Create an account to get started" 
                : "Enter your details to access your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            
            {/* Phase 1 of Sign Up or Login */}
            {(currentState === "Login" || (currentState === "Sign Up" && !isDataSubmitted)) && (
              <>
                {currentState === "Sign Up" && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">Full Name</label>
                    <input
                      type="text"
                      {...register("fullName", { required: currentState === "Sign Up" ? "Full name is required" : false })}
                      className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-red-400 text-xs">{errors.fullName.message}</p>}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <input
                    type="password"
                    {...register("password", { required: "Password is required" })}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
                </div>
              </>
            )}

            {/* Phase 2 of Sign Up */}
            {currentState === "Sign Up" && isDataSubmitted && (
              <div className="space-y-1" data-aos="fade-left">
                <div className="flex items-center gap-2 mb-4 cursor-pointer text-violet-400 hover:text-violet-300" onClick={() => setIsDataSubmitted(false)}>
                   <span>← Back</span>
                </div>
                <label className="text-sm font-medium text-gray-300">Tell us about yourself</label>
                <textarea 
                  rows={4} 
                  {...register("bio", {
                    required: "Bio is required",
                    minLength: {
                      value: 10,
                      message: "Bio must be at least 10 characters"
                    }
                  })}  
                  className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" 
                  placeholder="I am a software engineer..."
                ></textarea>
                {errors.bio && <p className="text-red-400 text-xs">{errors.bio.message}</p>}
              </div>
            )}

            <button className='mt-4 w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg transform transition-all active:scale-[0.98]'>
              {currentState === 'Sign Up' ? (isDataSubmitted ? 'Create Account' : 'Next') : 'Sign In'}
            </button>

            <div className="mt-4 text-center text-sm text-gray-400">
              {currentState === "Sign Up" ? "Already have an account?" : "Don't have an account?"}
              <span 
                onClick={() => {
                  setCurrentState(currentState === "Sign Up" ? "Login" : "Sign Up")
                  setIsDataSubmitted(false)
                }} 
                className="ml-2 text-violet-400 hover:text-violet-300 cursor-pointer font-medium"
              >
                {currentState === "Sign Up" ? "Login" : "Sign Up"}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
