import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});


io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.broadcast.emit("share_data");

    socket.on("message", (data) => {
        console.log(`Received message from ${socket.id}:`, data);
        socket.broadcast.emit("message", data);
    });

    socket.on("joinRoom",(roomId) => {
        console.log("roomId : " , roomId);
        socket.join(roomId)
        socket.to(roomId).emit("joined",roomId)
    })

    socket.on("Initial_Canvas",(shapes,roomId) => {
        console.log("shapes : ",shapes);
        
        socket.to(roomId).emit("initialCanvasState",shapes)
    })

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const port = process.env.PORT || 6005;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from Express!");
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
