import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContextObject.js'
import { ChatContext } from '../../context/ChatContextObject.js'
import assets from '../assets/assets.js'
import Avatar from './Avatar.jsx'
import ChatLoopLogo from './ChatLoopLogo.jsx'

const SideBar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMsg, setUnseenMsg } = useContext(ChatContext)
  const { logout, onlineUsers, authUser } = useContext(AuthContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  
  const menuRef = useRef(null)
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    
    setShowScrollTop(scrollTop > 50);
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 20;
    setShowScrollBottom(!isAtBottom && scrollHeight > clientHeight);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  const filteredUsers = searchTerm 
    ? users.filter((user) => user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) 
    : users

  useEffect(() => {
    getUsers()
  }, [onlineUsers, getUsers])

  useEffect(() => {
    handleScroll()
  }, [filteredUsers])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={`h-full flex flex-col bg-black/20 backdrop-blur-lg border-r border-white/10 ${selectedUser ? 'max-md:hidden' : 'w-full'} md:w-[350px]`}>
      
      {/* Header */}
      <div className='p-5 border-b border-white/10'>
        <div className='flex justify-between items-center mb-5'>
           <div className="flex items-center gap-2">
             <ChatLoopLogo className="w-6 h-6" />
             <span className="font-bold text-xl text-white tracking-wide">ChatLoop</span>
           </div>
           
           <div className='relative' ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full transition-colors ${isMenuOpen ? 'bg-white/10' : 'hover:bg-white/10'}`}
              >
                <img src={assets.menu_icon} alt="Menu" className='w-5 h-5 opacity-80' />
              </button>
              
              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className='absolute right-0 top-full mt-2 w-48 bg-[#1a1625] border border-gray-700 rounded-lg shadow-xl py-1 z-50'>
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm text-white font-medium truncate">{authUser?.fullName}</p>
                      <p className="text-xs text-gray-400 truncate">{authUser?.email}</p>
                    </div>
                    <button 
                      onClick={() => {
                        navigate('/profile')
                        setIsMenuOpen(false)
                      }} 
                      className='w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors'
                    >
                      Edit Profile
                    </button>
                    <button 
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }} 
                      className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors'
                    >
                      Log Out
                    </button>
                </div>
              )}
           </div>
        </div>

        {/* Search Bar */}
        <div className='relative'>
          <img src={assets.search_icon} className='absolute left-3 top-1/2 -translate-y-1/2 w-4 opacity-50' alt="search" />
          <input 
            onChange={(e) => setSearchTerm(e.target.value)} 
            type="text"
            className='w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all' 
            placeholder='Search users...' 
          />
        </div>
      </div>

      {/* Users List */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className='flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1 min-h-0 relative'
      >
         {/* Scroll Buttons */}
         <div className="sticky top-0 right-0 z-50 flex justify-end pointer-events-none">
            {showScrollTop && (
                <button 
                  onClick={scrollToTop}
                  className="pointer-events-auto absolute top-2 right-2 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/20 hover:bg-violet-600 transition-all shadow-xl"
                >
                    <img src={assets.arrow_icon} alt="Top" className="w-4 h-4 opacity-90 rotate-90" />
                </button>
            )}
        </div>
        <div className="sticky bottom-0 right-0 z-50 flex justify-end pointer-events-none">
            {showScrollBottom && (
                <button 
                  onClick={scrollToBottom}
                  className="pointer-events-auto absolute bottom-2 right-2 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/20 hover:bg-violet-600 transition-all shadow-xl"
                >
                    <img src={assets.arrow_icon} alt="Bottom" className="w-4 h-4 opacity-90 -rotate-90" />
                </button>
            )}
        </div>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => {
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedUser?._id === user._id;
            
            return (
              <div 
                onClick={() => {
                  setSelectedUser(user);
                  setUnseenMsg(prev => ({ ...prev, [user._id]: 0 }))
                }} 
                key={index} 
                className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  isSelected ? 'bg-violet-600 shadow-lg shadow-violet-900/20' : 'hover:bg-white/5'
                }`}
              >
                {/* Avatar with Status Dot */}
                <Avatar 
                  user={user} 
                  size="w-12 h-12" 
                  isOnline={isOnline}
                  showStatus={true}
                  className={`rounded-full object-cover border-2 ${isSelected ? 'border-white/30' : 'border-transparent group-hover:border-white/10'}`}
                />

                <div className='flex-1 min-w-0'>
                  <div className='flex justify-between items-baseline mb-0.5'>
                    <h3 className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                      {user.fullName}
                    </h3>
                    {unseenMsg[user._id] > 0 && (
                      <span className='bg-violet-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center'>
                        {unseenMsg[user._id]}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs truncate ${isSelected ? 'text-white/70' : 'text-gray-500 group-hover:text-gray-400'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-10">
             <p className="text-gray-500 text-sm">No users found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SideBar
