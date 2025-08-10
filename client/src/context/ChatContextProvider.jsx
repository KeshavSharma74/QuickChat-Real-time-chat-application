  import React, { useContext, useState, useEffect } from "react";
  import axios from "axios";
  import { io } from "socket.io-client";
  import AuthContext from "./authContext"; // ✅ corrected import
  import ChatContext from "./ChatContext"; // ✅ corrected import

  const ChatContextProvider = ({ children }) => {
    const { authUser } = useContext(AuthContext); // ✅ corrected `user` to `authUser`

    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);

    // 1. Connect to socket
    useEffect(() => {
      if (authUser?._id) {
        const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
          query: { userId: authUser._id },
          withCredentials: true,
        });

        setSocket(newSocket);
        return () => newSocket.close();
      }
    }, [authUser]);

    // 2. Listen for online users
    useEffect(() => {
      if (socket) {
        socket.on("getOnlineUsers", (online) => {
          setOnlineUsers(online);
        });
      }
    }, [socket]);

    // 3. Fetch all users (for sidebar)
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/v1/message/get-sidebar-users"); // ✅ corrected
        setUsers(res.data.sidebarUsers);
        // console.log(res.data.sidebarUsers)
      } catch (err) {
        console.error("Failed to fetch users:", err.message);
      }
    };

    // 4. Send a message
    const sendMessage = async (message) => {
      if (!message || !selectedUser) return;

      try {
        const res = await axios.post(`/api/v1/message/send/${selectedUser._id}`, {
          message,
        });

        socket.emit("send-message", {
          receiverId: selectedUser._id,
          message: res.data.message,
        });

        setMessages((prev) => [...prev, res.data.message]);
      } catch (err) {
        console.error("Error sending message:", err.message);
      }
    };

    // 5. Fetch chat messages
    const fetchMessages = async () => {
      if (!selectedUser) return;

      try {
        const res = await axios.get(`/api/v1/message/${selectedUser._id}`); // ✅ corrected
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err.message);
      }
    };

    return (
      <ChatContext.Provider
        value={{
          users,
          selectedUser,
          setSelectedUser,
          messages,
          setMessages,
          sendMessage,
          fetchMessages,
          onlineUsers,
          getUsers: fetchUsers,
        }}
      >
        {children}
      </ChatContext.Provider>
    );
  };

  export default ChatContextProvider;
