import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "./AuthContextObject.js";
import { ChatContext } from "./ChatContextObject.js";
import toast from "react-hot-toast";
 
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMsg, setUnseenMsg] = useState({});
  const [showProfilePanel, setShowProfilePanel] = useState(true);
  const [typingFromUserId, setTypingFromUserId] = useState(null);
  const { socket, axios, authUser } = useContext(AuthContext);

  const getUsers = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/messages/users');
      if (data.success) {
        setUsers(data.users);
        setUnseenMsg(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios]);

  const getMessages = useCallback(async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios]);

  const sendMessage = useCallback(async (messageData) => {
    try {
      const { data } = await axios.put(`/api/messages/send/${selectedUser._id}`, messageData);
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios, selectedUser]);

  const emitTyping = useCallback((receiverId) => {
    if (!socket || !authUser?._id || !receiverId) return;
    socket.emit("typing", { receiverId, senderId: authUser._id });
  }, [socket, authUser]);

  // REAL-TIME subscription
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMsg((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1
        }));
      }
    };

    const handleTyping = ({ senderId }) => {
      setTypingFromUserId(senderId);
      setTimeout(() => {
        setTypingFromUserId((prev) => (prev === senderId ? null : prev));
      }, 2000);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
    };
  }, [socket, selectedUser, axios]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    setUnseenMsg,
    unseenMsg,
    setMessages,
    showProfilePanel,
    setShowProfilePanel,
    typingFromUserId,
    emitTyping
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
