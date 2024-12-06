import express from "express";
import cors from "cors";
import socket_listeners_init from "./handlers/socket/socket_listeners_init";
import { EXPRESS_PORT } from "./utils/constants";
import ENSURE_SOCKET_SERVER from "./handlers/express/ENSURE_SOCKET_SERVER";
import GENERATE_ROOM from "./handlers/express/GENERATE_ROOM";
import RETRIVE_ROOM_ELEMENTS from "./handlers/express/RETRIVE_ROOM_ELEMENTS";

const app = express();

app.use(cors());

app.use(express.json());

app.listen(EXPRESS_PORT, () =>
	console.log("express running on " + EXPRESS_PORT)
);

socket_listeners_init();

app.use("/", ENSURE_SOCKET_SERVER);

app.use("/", GENERATE_ROOM);

app.use("/", RETRIVE_ROOM_ELEMENTS);
