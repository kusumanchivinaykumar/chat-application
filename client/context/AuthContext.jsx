import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContextObject.js";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  /* ✅ MOVE THIS UP */
  const connectSocket = useCallback(
    (userData) => {
      if (!userData || socket?.connected) return;

      const newSocket = io(backendUrl, {
        query: { userId: userData._id },
      });

      newSocket.connect();
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (userIds) => {
        setOnlineUsers(userIds);
      });
    },
    [socket]
  );

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.log(error);
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }, [connectSocket]);

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(
        `/api/auth/${state}`,
        credentials
      );

      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");

      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
      setOnlineUsers([]);

      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put(
        "/api/auth/update-profile",
        body
      );

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");

        if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    } else {
      delete axios.defaults.headers.common["token"];
      setAuthUser(null);
      setIsCheckingAuth(false);
    }
  }, [token, checkAuth]);

  const value = {
    token,
    login,
    logout,
    updateProfile,
    axios,
    authUser,
    isCheckingAuth,
    onlineUsers,
    socket,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
