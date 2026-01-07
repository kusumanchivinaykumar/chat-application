import React, { useContext, useState } from 'react'
import assets from '../assets/assets.js'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../../context/AuthContextObject.js'
import Avatar from '../components/Avatar.jsx'

const Profile = () => {
  const {authUser, updateProfile} = useContext(AuthContext)
  const [selectedImage, setSelectedImage] = useState(null)
  const navigate = useNavigate()
  
  // Initialize state with authUser data, but guard against null
  const [name, setName] = useState(authUser?.fullName || '')
  const [bio, setBio] = useState(authUser?.bio || '')
  
  // Local state is initialized from authUser; avoid redundant effect-based resets

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!selectedImage){
      await updateProfile({fullName: name, bio})
      navigate('/')
      return
    }

    const reader = new FileReader() 
    reader.readAsDataURL(selectedImage)
    
    reader.onload = async () => {
      const base64Image = reader.result
      await updateProfile({profilePic: base64Image, fullName: name, bio})
      navigate('/')
    }
  }

  if (!authUser) return null; // Should be handled by router, but extra safety

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#0f0c29] text-white p-4 relative overflow-hidden'>
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
        </div>

        <div className='w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 z-10'>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Edit Profile</h2>
                <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
                    <img src={assets.arrow_icon} alt="Back" className="w-6 rotate-180" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group cursor-pointer">
                        <Avatar 
                            user={authUser} 
                            src={selectedImage ? URL.createObjectURL(selectedImage) : null}
                            size="w-32 h-32" 
                            className="group-hover:opacity-80 transition-opacity"
                        />
                        <label htmlFor="avatar" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-xs font-medium">Change Photo</span>
                        </label>
                        <input onChange={(e)=>setSelectedImage(e.target.files[0])} type="file" id='avatar' hidden accept='.png, .jpg, .jpeg' />
                    </div>
                    <p className="text-gray-400 text-sm">Click to upload new avatar</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">Full Name</label>
                        <input 
                            onChange={(e)=>setName(e.target.value)} 
                            value={name} 
                            type="text" 
                            required 
                            placeholder='Your Name'  
                            className='w-full p-3 bg-black/20 border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all'
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">Bio</label>
                        <textarea 
                            onChange={(e)=>setBio(e.target.value)} 
                            value={bio} 
                            className='w-full p-3 bg-black/20 border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all min-h-[120px]' 
                            placeholder='Write something about yourself...' 
                            required 
                        ></textarea>
                    </div>
                </div>

                <div className="flex gap-4 mt-4">
                    <button  
                        type='button' 
                        onClick={() => navigate('/')}
                        className='flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all'
                    >
                        Cancel
                    </button>
                    <button  
                        type='submit' 
                        className='flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-lg shadow-lg transition-all'
                    >
                        Save Changes
                    </button>
                </div>

            </form>
        </div>
    </div>
  )
}

export default Profile
