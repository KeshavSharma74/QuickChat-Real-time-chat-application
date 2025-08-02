import express from "express";
import http from "http";
import "dotenv/config";
import { connectDB } from "./lib/database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { Server } from "socket.io";

const app = express();

// Set allowed origin (replace with your frontend's actual URL)
const CLIENT_ORIGIN = process.env.CLIENT_HOSTED_ORIGIN || "http://localhost:5173"; // e.g., Vite dev server

// Apply middlewares
app.use(cookieParser());
app.use(cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
}));
app.use(express.json({ limit: "4mb" }));

const server = http.createServer(app);

// initialize socket.io
export const io = new Server(server, {
    cors: {
        origin: CLIENT_ORIGIN,
        credentials: true,
    },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", userId);

    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected:", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("Server is listening at port:", port);
});

connectDB();

app.use('/api/v1/auth', userRoute);
app.use('/api/v1/message', messageRoute);

app.use('/api/v1', (req, res) => {
    return res.send("App is live");
});
