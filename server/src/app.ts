import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import socket_listeners_init from "./handlers/socket/socket_listeners_init";
import { start_socket_server } from "./handlers/socket/switch";
import { EXPRESS_PORT } from "./constants";
import { roomToElementsMap } from "./cache";

socket_listeners_init();

const app = express();
app.use(cors());
app.use(express.json());
app.listen(EXPRESS_PORT, () =>
	console.log("express running on " + EXPRESS_PORT)
);

app.get("/START_SOCKET_SERVER", (_, res) => {
	console.log("Socket Server opening requested");
	start_socket_server();

	res.status(200).send("Server is on");
});

app.get("/GENERATE_ROOM", (_, res) => {
	res.status(200).json({ roomId: randomUUID() });
});

app.post("/RETRIVE_ROOM_ELEMENTS", (req, res) => {
	const { roomId } = req.body;
	const elements = roomToElementsMap.get(roomId) || [];
	if (!elements.length) roomToElementsMap.set(roomId, []);
	res.status(200).json({ elements });
});
