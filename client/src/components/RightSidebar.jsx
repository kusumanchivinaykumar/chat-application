import React, { useContext, useMemo } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContextObject.js'
import { AuthContext } from '../../context/AuthContextObject.js'

const RightSidebar = () => {
  const {selectedUser, messages, showProfilePanel} = useContext(ChatContext)
  const {logout, onlineUsers} = useContext(AuthContext)
  const messageImages = useMemo(() => {
    return (messages || []).filter(msg => msg.image).map(msg => msg.image)
  }, [messages])

  if (!selectedUser || !showProfilePanel) return null;

  return (
    <div className="h-full bg-black/20 backdrop-blur-lg border-l border-white/10 overflow-y-auto custom-scrollbar p-6 hidden xl:block">
      
      {/* Profile Info */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4 group cursor-pointer">
            <img 
                src={selectedUser.profilePic || assets.avatar_icon} 
                alt="Profile"
                className='w-28 h-28 rounded-full object-cover border-4 border-white/10 shadow-xl group-hover:border-violet-500/50 transition-all'
            />
            {onlineUsers.includes(selectedUser._id) && (
                <span className='absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#1a1625] rounded-full'></span>
            )}
        </div>
        
        <h2 className='text-xl font-bold text-white mb-1'>{selectedUser.fullName}</h2>
        <p className='text-sm text-gray-400 mb-4'>{selectedUser.email}</p>
        
        <div className="bg-white/5 rounded-xl p-4 w-full border border-white/5">
            <p className='text-sm text-gray-300 leading-relaxed italic'>
            "{selectedUser.bio || "No bio available"}"
            </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-white/10 mb-6"></div>

      {/* Media Gallery */}
      <div className='mb-8'>
        <div className="flex items-center justify-between mb-4">
            <h3 className='text-sm font-semibold text-gray-300 uppercase tracking-wider'>Shared Media</h3>
            <span className="text-xs text-gray-500">{messageImages.length} files</span>
        </div>
        
        {messageImages.length > 0 ? (
            <div className='grid grid-cols-3 gap-2'>
            {messageImages.map((url, index) => (
                <div 
                    key={index} 
                    onClick={() => window.open(url, '_blank')} 
                    className='relative aspect-square rounded-lg overflow-hidden cursor-pointer group border border-white/10'
                >
                    <img 
                        src={url} 
                        alt="Shared" 
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300' 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <img src={assets.search_icon} className="w-4 h-4 invert opacity-70" alt="View" />
                    </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-8 bg-white/5 rounded-xl border border-white/5 border-dashed">
                <p className="text-gray-500 text-xs">No media shared yet</p>
            </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto">
        <button 
            onClick={() => logout()} 
            className='w-full py-3 bg-gradient-to-r from-red-500/80 to-red-700/80 hover:from-red-500 hover:to-red-700 text-white font-medium rounded-xl shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-center gap-2'
        >
            <span>Log Out</span>
        </button>
      </div>
      
    </div>
  )
}

export default RightSidebar
