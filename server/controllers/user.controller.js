import bcrypt from "bcryptjs";
import { generateToken } from "../lib/util.js";
import User from "../models/User.model.js";
import "dotenv/config"
import transporter from "../lib/nodemailer.js";

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
        text: `Welcome to QuickChat! Your account has been created with email id: ${email}`,
        // html:WELCOME_EMAIL_TEMPLATE.replace("{{email}}",email).replace("{{name}}",name),
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

export {signup,login}