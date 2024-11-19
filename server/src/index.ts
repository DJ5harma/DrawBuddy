import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

const io = new Server({ cors: { origin: "*" } });
const app = express();
app.use(cors());
app.use(express.json());

app.listen(3001, () => console.log("express running on 3001"));

let socketClosed = true;
let startedTimerToCloseServer = false;
let clients = 0;

function startSocketServer() {
	if (!socketClosed) return;
	io.listen(3000);
	socketClosed = false;
	console.log("Socket running at 3000");
}
function closeSocketServer() {
	if (clients > 0 || startedTimerToCloseServer) return;
	startedTimerToCloseServer = true;
	console.log("Started to close wss", clients);

	setTimeout(() => {
		if (!clients) {
			io.close();
			socketClosed = true;
			startedTimerToCloseServer = false;
			console.log("Socket server closed");
		} else {
			console.log("Didn't close");
			startedTimerToCloseServer = false;
		}
	}, 10000);
}

app.get("/GENERATE_ROOM", (req, res) => {
	startSocketServer();
	res.json({ roomId: randomUUID() });
});

io.on("connection", (socket) => {
	console.log(++clients);

	socket.on("i arrived at room", (id) => {
		console.log(socket.id, " arrived");
	});

	socket.on("disconnect", () => {
		console.log(--clients);
		closeSocketServer();
	});
});
