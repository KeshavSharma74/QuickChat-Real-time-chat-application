import { Router } from "express";
import { login, signup } from "../controllers/user.controller.js";

const route = Router();

route.post('/signup',signup);
route.post('/login',login);

export default route
