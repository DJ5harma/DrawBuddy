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

interface IPeers {
	[userid: string]: {
		username: string;
		tempElement: any;
	};
}

const roomToUsersMap = new Map<string, IPeers>();
const useridToRoomMap = new Map<string, string>();

io.on("connection", (socket) => {
	console.log(++clients);

	socket.on("i arrived at room", ({ roomId, username }) => {
		console.log(socket.id, " arrived");

		const userObj = { userid: socket.id, username };
		socket.to(roomId).emit("new_user", userObj);

		let prevUsers = roomToUsersMap.get(roomId) || {};
		socket.emit("previous_users", prevUsers);
		prevUsers[socket.id] = { username, tempElement: null };

		roomToUsersMap.set(roomId, prevUsers);

		console.log({ prevUsers });

		socket.join(roomId);

		useridToRoomMap.set(socket.id, roomId);
	});

	socket.on("finalized new element", ({ element, roomId }) => {
		socket.broadcast.to(roomId).emit("incoming finalized element", element);
	});
	socket.on("creating new element", ({ element, roomId }) => {
		socket.broadcast
			.to(roomId)
			.emit("incoming element in making", { element, userid: socket.id });
	});

	socket.on("disconnect", () => {
		console.log(--clients);
		const roomId = useridToRoomMap.get(socket.id);
		if (roomId) {
			useridToRoomMap.delete(socket.id);
			let prevUsers = roomToUsersMap.get(roomId);
			if (prevUsers) {
				delete prevUsers[socket.id];
				roomToUsersMap.set(roomId, prevUsers);
			}
		}
		// closeSocketServer();
	});
});
