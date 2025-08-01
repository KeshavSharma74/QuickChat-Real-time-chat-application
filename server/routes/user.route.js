import { Router } from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const userRoute = Router();

userRoute.post('/signup',signup);
userRoute.post('/login',login);
userRoute.post('/check-auth',protectRoute,checkAuth);
userRoute.post('/updated-profile',protectRoute,updateProfile)

export default userRoute
