import bcrypt from "bcryptjs";
import { generateToken } from "../lib/util.js";
import User from "../models/User.model.js";
import "dotenv/config"
import transporter from "../lib/nodemailer.js";
import { WELCOME_EMAIL_TEMPLATE } from "../lib/emailTemplate.js";
import cloudinary from "../lib/cloudinary.js";

const signup = async(req,res)=>{

    const {fullname,email,password,bio} = req.body;

    try{

        if(!fullname || !email || !password || !bio){
            return res.status(200).json({
                success:false,
                message:"Fullname, email, password and bio is mandatory."
            })
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                success:false,
                message:"Email already registered."
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser =await User.create({
            fullname,
            email,
            password:hashedPassword,
            bio,
        })

        const token= generateToken(newUser._id);

        res.cookie('token',token,{
            httpOnly:true,
            secure:true,
            maxAge:7*24*60*60*1000
        })

        await transporter.sendMail({
        from: process.env.SENDER_MAIL,
        to: email,
        subject: "Welcome to QuickChat",
        // text: `Welcome to QuickChat! Your account has been created with email id: ${email}`,
        html:WELCOME_EMAIL_TEMPLATE.replace("{{email}}",email).replace("{{name}}",fullname),
        });
        
        return res.status(200).json({
            sucess:true,
            userData:newUser,
            message:"User registered successfully.",
            token
        })

    }
    catch(error){

        console.log(error);

        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

const login = async(req,res)=>{

    const {email,password} = req.body;

    try{

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and Password are required.",
            })
        }

        const user = await User.findOne({email});

        const isCorrectPassword = await bcrypt.compare(password,user.password);

        if(!isCorrectPassword){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password"
            })
        }

        const token=generateToken(user._id);

        res.cookie('token',token,{
            httpOnly:true,
            secure:true,
        })

        return res.status(200).json({
            success:true,
            message:"User loggedin successfully.",
            token
        })

    }
    catch(error){
        
        console.log(error);

        res.status(500).json({
            success:false,
            message:error.message,
        })

    }

}

const checkAuth = (req,res)=>{

    // console.log(req.user);

    return res.status(200).json({
        success:true,
        userData:req.user,
        message:"Data fetched Successfully"
    })
}

const updateProfile = async(req,res)=>{

    const {profilePic,bio,fullname}=req.body;

    try{

        const userId=req.user._id;

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"User is not logged in or token is not stored in the cookies"
            })
        }

        let updatedUser;

        if(!profilePic){

            updatedUser = await User.findByIdAndUpdate(userId,{fullname,bio},{new:true});

        }
        else{

            const upload = cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId,{fullname,bio,profilePic:(await upload).secure_url},{new:true});

        }

        return res.status(200).json({
            success:true,
            userData:updatedUser,
            message:"Profile Updated Successfully.",
        })

    }
    catch(error){

        console.log(error);

        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }

}

export {signup,login,checkAuth,updateProfile}