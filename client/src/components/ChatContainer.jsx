import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/Utils';
import { AuthContext } from '../../context/AuthContextObject.js'
import { ChatContext } from '../../context/ChatContextObject.js'
import toast from 'react-hot-toast';
import Avatar from './Avatar.jsx';
import ChatLoopLogo from './ChatLoopLogo.jsx'
 
const EmojiPicker = ({ onPick }) => {
  const [open, setOpen] = useState(false)
  const emojis = ['😀','😂','😍','👍','🙏','🎉','❤️','🔥','😎','😢']
  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setOpen(!open)} 
        className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-violet-400"
        title="Emoji"
      >
        <span className="text-lg">🙂</span>
      </button>
      {open && (
        <div className="absolute bottom-10 right-0 bg-[#1a1625] border border-white/10 rounded-xl p-2 shadow-xl flex flex-wrap gap-1 w-40 z-50">
          {emojis.map((e) => (
            <button 
              key={e} 
              type="button"
              className="text-xl hover:scale-110 transition-transform"
              onClick={() => {
                onPick(e)
                setOpen(false)
              }}
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ChatContainer = () => {
  const {messages, selectedUser, setSelectedUser, sendMessage, getMessages, typingFromUserId, emitTyping, showProfilePanel, setShowProfilePanel} = useContext(ChatContext)
  const {authUser, onlineUsers} = useContext(AuthContext)
  
  // Refs for scrolling and auto-scroll management
  const scrollContainerRef = useRef(null);
  const wasAtBottomRef = useRef(true); // Tracks if user was at the bottom before a new message

  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Constants
  const SCROLL_THRESHOLD = 80; // Distance in pixels to consider "at bottom"

  // Helper: Check scroll position and update state/refs
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // Scroll detection: Show 'Scroll to Top' if scrolled down
    setShowScrollTop(scrollTop > 50);

    // Scroll detection: Check if user is near the bottom
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isAtBottom = distanceFromBottom <= SCROLL_THRESHOLD;

    // Update sticky scroll ref
    // We update this on scroll so we know the user's intent when a new message arrives
    wasAtBottomRef.current = isAtBottom;

    // Button visibility logic
    setShowScrollBottom(!isAtBottom);
  };

  const handleScroll = () => {
    checkScrollPosition();
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToBottom = (behavior = "smooth") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ 
        top: scrollContainerRef.current.scrollHeight, 
        behavior: behavior 
      });
    }
  };

  // Auto-scroll logic: Handle new messages
  React.useLayoutEffect(() => {
    if (!messages || !scrollContainerRef.current) return;

    const lastMessage = messages[messages.length - 1];
    const isMyMessage = lastMessage?.senderId === authUser._id;

    // If I sent the message OR I was already at the bottom, auto-scroll
    if (isMyMessage || wasAtBottomRef.current) {
      scrollToBottom();
    }
  }, [messages, authUser]);

  // Reset scroll state when changing conversation
  useEffect(() => {
    if (selectedUser && authUser?._id) {
      getMessages(selectedUser._id);
      wasAtBottomRef.current = true; // Reset to true so we start at bottom of new chat
      setShowScrollBottom(false);
    }
  }, [selectedUser, authUser, getMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "" || isSending) return;
    
    setIsSending(true)
    try {
        await sendMessage({text: input.trim()})
        setInput("")
    } catch (error) {
        console.error(error)
    } finally {
        setIsSending(false)
    }
  }
  
  const handleInputChange = (e) => {
    const val = e.target.value
    setInput(val)
    if (selectedUser?._id) {
      emitTyping(selectedUser._id)
    }
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("Please select an image file")
      return
    }
    
    // Check file size (max 5MB)
    if(file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
    }

    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
          await sendMessage({image: reader.result})
      } catch (E) {
          toast.error(E?.message || "Failed to send image")
      }
    }
    reader.readAsDataURL(file)
  }

  if (!selectedUser) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-black/20 backdrop-blur-lg h-full">
            <div className="w-24 h-24 bg-violet-600/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <ChatLoopLogo className="w-12 h-12 opacity-80" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to ChatLoop</h2>
            <p className="text-gray-400 max-w-md">
                Select a conversation from the sidebar to start chatting or search for new friends to connect with.
            </p>
        </div>
    )
  }

  return (
    <div className='h-full flex flex-col relative bg-black/20 backdrop-blur-lg'>
     
      {/* Header */}
      <div className='flex items-center gap-4 py-3 px-6 border-b border-white/10 bg-white/5'>
        <div className="relative">
            <Avatar 
                user={selectedUser} 
                size="w-10 h-10" 
                isOnline={onlineUsers.includes(selectedUser._id)}
                showStatus={true}
            />
        </div>
        
        <div className='flex-1 min-w-0'>
          <h3 className='text-lg font-semibold text-white truncate'>
              {selectedUser.fullName}
          </h3>
          <p className='text-xs text-gray-400 truncate'>
              {onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Offline'}
          </p>
        </div>
        
        <button onClick={() => setSelectedUser(null)} className='md:hidden p-2 hover:bg-white/10 rounded-full transition-colors'>
                <img src={assets.arrow_icon} alt="Back" className='w-5 rotate-180 opacity-80' />
            </button>
            
            <button 
              onClick={() => setShowProfilePanel(!showProfilePanel)} 
              className='ml-auto p-2 hover:bg-white/10 rounded-full transition-colors hidden xl:inline-flex'
              title={showProfilePanel ? 'Hide profile' : 'Show profile'}
            >
              <span className="text-xs text-gray-300">{showProfilePanel ? 'Hide Info' : 'Show Info'}</span>
            </button>
            <div className="hidden md:flex items-center gap-2 ml-3">
              <ChatLoopLogo className="w-5 h-5" />
              <span className="text-[11px] text-violet-300">ChatLoop</span>
            </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className='flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-4 min-h-0 relative'
      >
        {(!messages || messages.length === 0) ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <p>No messages yet. Start the conversation!</p>
            </div>
        ) : (
            messages.map((msg, index) => {
                const isSender = msg.senderId === authUser._id;
                return (
                  <div key={index} className={`flex items-end gap-3 ${isSender ? 'justify-end' : 'justify-start'}`}>
                    
                    {!isSender && (
                        <Avatar user={selectedUser} size="w-8 h-8" className='mb-1' />
                    )}

                    <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-[75%]`}>
                        {msg.image && (
                          <div className="mb-2 overflow-hidden rounded-2xl border border-white/10">
                              <img 
                                src={msg.image} 
                                alt="attachment" 
                                className='max-w-[250px] object-cover hover:scale-105 transition-transform cursor-pointer'
                                onClick={() => window.open(msg.image, '_blank')}
                              />
                          </div>
                        )}
                        
                        {msg.text && (
                          <div className={`px-5 py-3 text-sm leading-relaxed shadow-md break-words relative group
                            ${isSender 
                                ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-2xl rounded-br-none' 
                                : 'bg-[#2a2636] text-gray-100 rounded-2xl rounded-bl-none border border-white/5'
                            }`}>
                            {msg.text}
                            <div className={`absolute bottom-0 ${isSender ? '-left-12' : '-right-12'} opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-500 mb-2 whitespace-nowrap`}>
                                {formatMessageTime(msg.createdAt)}
                            </div>
                            {isSender && (
                              <div className="mt-1 text-[10px] text-gray-300">
                                {msg.seen ? '✔✔' : '✔'}
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                )
            })
        )}
        
        {typingFromUserId === selectedUser?._id && (
          <div className="flex justify-start">
            <div className="px-3 py-1 text-xs bg-white/10 text-gray-200 rounded-full">
              typing…
            </div>
          </div>
        )}
      </div>

      {/* Scroll Buttons - Positioned relative to the main container */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="absolute top-20 right-6 z-50 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/20 hover:bg-violet-600 transition-all shadow-xl group"
          title="Scroll to Top"
        >
            <img src={assets.arrow_icon} alt="Top" className="w-5 h-5 opacity-90 group-hover:opacity-100 rotate-90" />
        </button>
      )}

      {showScrollBottom && (
        <button 
          onClick={() => scrollToBottom()}
          className="absolute bottom-24 right-6 z-50 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/20 hover:bg-violet-600 transition-all shadow-xl group"
          title="Scroll to Bottom"
        >
            <img src={assets.arrow_icon} alt="Bottom" className="w-5 h-5 opacity-90 group-hover:opacity-100 -rotate-90" />
        </button>
      )}

      {/* Input Area */}
      <div className='p-4 bg-white/5 border-t border-white/10'>
        <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-4xl mx-auto">
            <div className="flex-1 bg-[#1a1625] border border-white/10 rounded-full flex items-center px-4 py-2 focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/50 transition-all">
                <input 
                    type="text" 
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type a message..." 
                    className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                />
                <EmojiPicker onPick={(emoji) => setInput((prev) => prev + emoji)} />
                
                <input 
                    type="file" 
                    id="image-upload" 
                    hidden 
                    accept="image/*" 
                    onChange={handleSendImage}
                />
                <label htmlFor="image-upload" className="p-2 hover:bg-white/10 rounded-full cursor-pointer transition-colors text-gray-400 hover:text-violet-400">
                    <img src={assets.gallery_icon} alt="Gallery" className="w-5 h-5 opacity-70 hover:opacity-100" />
                </label>
                
                <button 
                    type="submit" 
                    disabled={isSending || !input.trim()}
                    className="ml-2 p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-full shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-10 h-10"
                >
                    {isSending ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <img src={assets.send_button} alt="Send" className="w-5 h-5" />
                    )}
                </button>
            </div>
        </form>
      </div>

    </div>
  )
}

export default ChatContainer
