import bcrypt from "bcryptjs";
import { generateToken } from "../lib/util.js";
import User from "../models/User.model.js";
import "dotenv/config"
import transporter from "../lib/nodemailer.js";
import { WELCOME_EMAIL_TEMPLATE } from "../lib/emailTemplate.js";
import cloudinary from "../lib/cloudinary.js";

// Fix the login function - add user existence check
const login = async(req, res) => {
    const {email, password} = req.body;
    // console.log("ab agya mei login controller mei");
    
    try {
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required.",
            });
        }

        const user = await User.findOne({email});
        
        // Add this check that was missing
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if(!isCorrectPassword) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            userData: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                bio: user.bio,
                profilePic: user.profilePic
            },
            message: "User logged in successfully.",
            token
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error,
        });
    }
};

// Fix the signup function - return user data
const signup = async(req, res) => {
    const {fullname, email, password, bio} = req.body;

    try {
        if(!fullname || !email || !password || !bio) {
            return res.status(400).json({
                success: false,
                message: "Fullname, email, password and bio is mandatory."
            });
        }

        const user = await User.findOne({email});

        if(user) {
            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            bio,
        });

        const token = generateToken(newUser._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Send welcome email (existing code)
        await transporter.sendMail({
            from: process.env.SENDER_MAIL,
            to: email,
            subject: "Welcome to QuickChat",
            html: WELCOME_EMAIL_TEMPLATE.replace("{{email}}", email).replace("{{name}}", fullname),
        });
        
        return res.status(200).json({
            success: true,
            userData: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                bio: newUser.bio,
                profilePic: newUser.profilePic
            },
            message: "User registered successfully.",
            token
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

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

            updatedUser = await User.findByIdAndUpdate(userId,{fullname,bio},{new:true}).select("-password");

        }
        else{

            const upload = cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId,{fullname,bio,profilePic:(await upload).secure_url},{new:true}).select("-password");

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

const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully."
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export { signup, login, checkAuth, updateProfile, logout };