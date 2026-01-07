import React from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'

const Home = () => {
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#0f0c29] relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-[320px] border-r border-white/10 bg-black/20 backdrop-blur-lg flex-shrink-0">
        <SideBar />
      </div>
      
      <div className="flex-1 flex flex-col bg-black/20 backdrop-blur-lg">
        <ChatContainer />
      </div>
      
      <div className="w-[300px] border-l border-white/10 bg-black/20 backdrop-blur-lg hidden xl:block">
        <RightSidebar />
      </div>
    </div>
  )
}

export default Home
