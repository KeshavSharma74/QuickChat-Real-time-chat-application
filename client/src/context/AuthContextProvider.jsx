import { useEffect, useState } from "react";
import AuthContext from "./authContext";
import toast from "react-hot-toast";
import axios from "axios"
import {io} from 'socket.io-client'

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;                            

const AuthContextProvider = (props)=>{

    const [authUser,setAuthUser] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const [socket,setSocket]=useState(null);

    const checkAuth = async()=>{
        try{
            const response= await axios.get('/auth/check-auth',{
                withCredentials:true
            })
            if(response.data.success){
                setAuthUser(response.data.userData);
                connectSocket(response.data.userData)
            }
            toast.success()
        }
        catch(error){
            toast.error(error.message)
        }
    }


    const connectSocket = (userData) =>{
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl,{
            query:{
                userId:userData._id
            }
        });
        
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds);
        })
    }

    const login = async(state,credentials)=>{
        try{
            const {data}=await axios.post(`/api/v1/auth/${state}`,credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                toast.success(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }   
    }

    useEffect( ()=>{
        checkAuth
    },[])

    const value={
        authUser,
        setAuthUser,
        onlineUsers,
        setOnlineUsers,
        socket,
        setSocket,
        login
    }

    return (
        <AuthContext.Provider value={value} >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;