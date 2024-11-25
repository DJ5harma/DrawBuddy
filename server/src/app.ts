import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import socket_listeners_init from "./handlers/socket/socket_listeners_init";
import { start_socket_server } from "./handlers/socket/switch";

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3001, () => console.log("express running on 3001"));

app.get("/START_SOCKET_SERVER", (_, res) => {
	console.log("Socket Server opening requested");
	start_socket_server();

	res.status(200).send("Server is on");
});

app.get("/GENERATE_ROOM", (_, res) => {
	res.json({ roomId: randomUUID() });
});

socket_listeners_init();
