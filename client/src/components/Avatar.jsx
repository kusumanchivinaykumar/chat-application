import React from 'react'

const Avatar = ({ user, size = "w-12 h-12", className = "", showStatus = false, isOnline = false, src }) => {
  const getInitials = (name) => {
    if (!name) return "?"
    return name.charAt(0).toUpperCase()
  }

  // Use a predefined set of colors for backgrounds based on name length or something deterministic
  const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
    "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
  ]
  
  const getColor = (name) => {
    if (!name) return "bg-gray-500"
    const index = name.length % colors.length
    return colors[index]
  }

  const imageSrc = src || user?.profilePic

  return (
    <div className={`relative ${className} flex-shrink-0`}>
      {imageSrc ? (
        <img 
          src={imageSrc} 
          alt={user?.fullName || "Avatar"} 
          className={`${size} rounded-full object-cover border border-white/10`} 
        />
      ) : (
        <div className={`${size} rounded-full flex items-center justify-center text-white font-bold text-lg border border-white/10 ${getColor(user?.fullName)}`}>
          {getInitials(user?.fullName)}
        </div>
      )}
      
      {showStatus && isOnline && (
        <span className='absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#0f0c29] rounded-full'></span>
      )}
    </div>
  )
}

export default Avatar
