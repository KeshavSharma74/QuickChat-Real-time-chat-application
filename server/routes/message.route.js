import { Router } from "express";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const messageRoute = Router();

messageRoute.get('/get-sidebar-users',protectRoute,getUsersForSidebar);
messageRoute.get('/:id',protectRoute,getMessages);
messageRoute.put('/mark/:id',protectRoute,markMessageAsSeen);
messageRoute.post('/send/:id',protectRoute,sendMessage);

export default messageRoute;