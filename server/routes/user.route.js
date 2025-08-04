import { Router } from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const userRoute = Router();

userRoute.post('/signup', signup);
userRoute.post('/login', login);
userRoute.get('/check-auth', protectRoute, checkAuth); // Changed to GET
userRoute.put('/update-profile', protectRoute, updateProfile); // Fixed URL and method
userRoute.post('/logout', logout); // Removed protectRoute since we're clearing cookies

export default userRoute;