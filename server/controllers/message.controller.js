
// get all the users except loggedin user

import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";
import { userSocketMap } from "../server.js";

const getUsersForSidebar = async(req,res)=>{
    try{

        const userId = req.user._id;
        console.log(userId);
        
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"Either is not logged in or token is not getting stored in cookies",
            })
        }

        const OtherUsers =await User.find({_id:{$ne:userId}}).select("-password");

        let unseenMessages={};

        OtherUsers.map( async(user)=>{
            const messageSentByOtherUsersToSelectedUser = await Message.find({senderId:user._id,receiverId:userId,seen:false});
            if(messageSentByOtherUsersToSelectedUser.length>0){
                unseenMessages[user._id]=messageSentByOtherUsersToSelectedUser.length;
            }
        } )

        return res.status(200).json({
            success:true,
            message:"Users for sidebar fetched successfully.",
            sidebarUsers:OtherUsers,
            unseenMessages,
        })

    }
    catch(error){

        console.log(error.message);
        
        return res.status(500).json({
            success:false,
            message:error.message
        })

    }
}

// get messages for selected User

const getMessages = async(req,res)=>{

    const {selectedUserId} = req.params.id;

    const loggedinUserId = req.user._id;

    try{

        const conversationBetweenLoggedinUserAndSelectedUser = await Message.find({
            $or:[
                {senderId:selectedUserId,receiverId:loggedinUserId},
                {senderId:loggedinUserId,receiverId:selectedUserId}
            ]
        });
        
        await Message.updateMany({senderId:selectedUserId,receiverId:loggedinUserId},{seen:true});

        res.status(200).json({
            success:true,
            message:"Conversation between loggedin user and selected user fetched successfully.",
            messages:conversationBetweenLoggedinUserAndSelectedUser
        })

    }
    catch(error){

        console.log(error.message);
        
        res.status(500).json({
            success:false,
            message:error.message
        })

    }
}

const markMessageAsSeen = async(req,res)=>{
    
    try{

        const {id} = req.params;

        await Message.findByIdAndUpdate(id,{seen:true});

        return res.status(200).json({
            success:true,
            message:"All the messages sent by Sender has been marked as seen successfully."
        })

    }
    catch(error){

        console.log(error.message);
        
        return res.status(500).json({
            success:false,
            message:error.message
        })

    }

}

const sendMessage = async(req,res)=>{

    const {receiverId} = req.params.id;
    const senderId = req.user._id;
    const {text,image}=req.body;

    try{

        let imageUrl;
        
        if(image){
            
            const uploadResponse = cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;

        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            imageUrl
        })

        const receiverSocketId = userSocketMap[receiverId];

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        return res.status(200).json({
            success:true,
            message:"Message added to the database successfully.",
            messageData:newMessage
        })

    }
    catch(error){

        console.log(error.message);

        return res.status(500).json({
            success:false,
            message:error.message
        })

    }
}

export {getUsersForSidebar,getMessages,markMessageAsSeen,sendMessage}