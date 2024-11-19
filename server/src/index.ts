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
			roomToUsersMap.clear();
			useridToRoomMap.clear();
		} else {
			console.log("Didn't close");
			startedTimerToCloseServer = false;
		}
	}, 10000);
}

// app.get("/START_SOCKET_SERVER", startSocketServer, (_, res) => {
// 	res.status(200).send("Socket is on now");
// });
io.listen(3000);
app.get("/GENERATE_ROOM", (_, res) => {
	res.json({ roomId: randomUUID() });
});

interface IPeerUser {
	userid: string;
	username: string;
}
const roomToUsersMap = new Map<string, IPeerUser[]>();
const useridToRoomMap = new Map<string, string>();

io.on("connection", (socket) => {
	console.log(++clients);

	socket.on("i arrived at room", ({ roomId, username }) => {
		console.log(socket.id, " arrived");

		const userObj = { userid: socket.id, username };

		let prevUsers = roomToUsersMap.get(roomId) || [];
		prevUsers = [...prevUsers, userObj];
		roomToUsersMap.set(roomId, prevUsers);
		socket.emit("previous_users", prevUsers);

		socket.broadcast.to(roomId).emit("new_user", userObj);
		socket.join(roomId);

		useridToRoomMap.set(socket.id, roomId);
	});

	socket.on("my new element", ({ element, roomId }) => {
		socket.broadcast.to(roomId).emit("incoming_element", element);
	});

	socket.on("disconnect", () => {
		console.log(--clients);
		const roomId = useridToRoomMap.get(socket.id);
		if (roomId) {
			let prevUsers = roomToUsersMap
				.get(roomId)
				?.filter(({ userid }) => userid !== socket.id);
			useridToRoomMap.delete(socket.id);
			roomToUsersMap.set(roomId, prevUsers || []);
		}
		// closeSocketServer();
	});
});