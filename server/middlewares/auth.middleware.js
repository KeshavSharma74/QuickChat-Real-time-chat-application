import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async(req,res,next)=>{

    const {token}=req.cookies;

    try{

        if(!token){
            return res.status(400).json({
                success:false,
                message:"Token is not present in cookies"
            })
        }

        const decodedToken=jwt.verify(token,process.env.JWT_SECRET);

        const user=await User.findOne(decodedToken.userId).select("-password");

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found from the token present in cookie"
            })
        }

        // console.log("ab mei user print krunga : ",user);
        req.user=user;

        next();
    }
    catch(error){

        console.log(error.message);

        return res.json(400).json({
            success:false,
            message:error.message
        })
    }
}