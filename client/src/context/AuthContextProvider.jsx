import { useEffect, useState } from "react";
import AuthContext from "./authContext";
import toast from "react-hot-toast";
import axios from "axios";
import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

const AuthContextProvider = (props) => {
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    const checkAuth = async () => {
        try {
            // Fixed URL - should be GET request
            const response = await axios.get('/api/v1/auth/check-auth');
            if(response.data.success) {
                setAuthUser(response.data.userData);
                connectSocket(response.data.userData);
            }
        } catch(error) {
            console.log("Auth check failed:", error);
            // Don't show error toast for auth check failures
        }
    };

    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id
            }
        });
        
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    };

    const login = async (state, credentials) => {
        console.log("login call hogya");
        console.log("login hogya call");
        
        try {
            const { data } = await axios.post(`/api/v1/auth/${state}`, credentials);
            console.log("yahan tk agtya mei");
            
            if(data.success) {
                console.log("data successfult");
                
                setAuthUser(data.userData);
                connectSocket(data.userData);
                toast.success(data.message);
            }
            console.log("data : ",data);
        } catch(error) {
            toast.error(error.response?.data?.message || error.message);
        }   
    };

    const logout = async () => {
        console.log("logout call hogya");
        
        try {
            const { data } = await axios.post('/api/v1/auth/logout');
            if(data.success) {
                setAuthUser(null);
                setOnlineUsers([]);
                if(socket) {
                    socket.disconnect();
                    setSocket(null);
                }
                toast.success("Logged Out Successfully");
            }
        } catch(error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const updateProfile = async (body) => {
        try {
            // Fixed URL typo
            const { data } = await axios.put("/api/v1/auth/update-profile", body);
            if(data.success) {
                setAuthUser(data.userData);
                toast.success("Profile Updated Successfully");
            }
        } catch(error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        authUser,
        setAuthUser,
        onlineUsers,
        setOnlineUsers,
        socket,
        setSocket,
        login,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;