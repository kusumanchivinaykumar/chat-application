import React from 'react'

const ChatLoopLogo = ({ className = 'w-6 h-6' }) => {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="clg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="none" stroke="url(#clg)" strokeWidth="2" />
      <path d="M8 12c0-2.2 1.8-4 4-4m4 4c0 2.2-1.8 4-4 4" fill="none" stroke="url(#clg)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="12" r="1.5" fill="#7c3aed" />
      <circle cx="16" cy="12" r="1.5" fill="#2563eb" />
    </svg>
  )
}

export default ChatLoopLogo
