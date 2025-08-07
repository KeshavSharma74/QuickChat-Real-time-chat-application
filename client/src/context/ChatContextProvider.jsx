import { useContext, useEffect, useState } from "react";
import ChatContext from "./ChatContext";
import AuthContext from "./authContext";
import axios from "axios";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

const ChatContextProvider = ({ props }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket } = useContext(AuthContext);

    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/v1/message/get-sidebar-users');
            if (data.success) {
                setUsers(data.sidebarUsers);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getMessages = async (id) => {
        try {
            const { data } = await axios.get(`/api/v1/message/${id}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const sendMessages = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/v1/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.messageData]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // 🔔 Subscribe to new messages
    useEffect(() => {
        const subscribeToMessages = async () => {
            if (!socket) return;

            socket.on("newMessage", (newMessage) => {
                if (selectedUser && newMessage.senderId === selectedUser._id) {
                    newMessage.seen = true;
                    setMessages((prevMessages) => [...prevMessages, newMessage]);

                    axios.put(`/api/messages/mark/${newMessage._id}`);
                } else {
                    setUnseenMessages((prevUnseenMessages) => ({
                        ...prevUnseenMessages,
                        [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
                            ? prevUnseenMessages[newMessage.senderId] + 1
                            : 1,
                    }));
                }
            });
        };

        subscribeToMessages();

        // ✅ Clean up the socket event to prevent duplicates
        return () => {
            if (socket) socket.off("newMessage");
        };
    }, [socket, selectedUser]);

    const value = {
        getUsers,
        getMessages,
        sendMessages,
        selectedUser,
        setSelectedUser,
        messages,
        setMessages,
        users,
        unseenMessages,
        setUnseenMessages,
    };

    return (
        <ChatContext.Provider value={value}>
            {props.children}
        </ChatContext.Provider>
    );
};

export default ChatContextProvider;
