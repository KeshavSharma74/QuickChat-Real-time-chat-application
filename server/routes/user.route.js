import { Router } from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const route = Router();

route.post('/signup',signup);
route.post('/login',login);
route.post('/check-auth',protectRoute,checkAuth);
route.post('/updated-profile',protectRoute,updateProfile)

export default route
