import { Router } from "express";
import { getMessages, getUsersForSidebar, markMessageAsSeen } from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const messageRoute = Router();

messageRoute.get('/get-sidebar-users',protectRoute,getUsersForSidebar);
messageRoute.get('/:id',protectRoute,getMessages);
messageRoute.put('/mark/:id',protectRoute,markMessageAsSeen);

export default messageRoute;