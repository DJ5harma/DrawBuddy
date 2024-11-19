import { Server } from "socket.io";
import express from "express";
import cors from "cors";
const io = new Server({ cors: { origin: "*" } });
io.listen(3000);
console.log("Socket running on 3000");

let count = 0;

const app = express();
app.use(cors());
app.use(express.json());
app.listen(3001, () => {
	console.log("express running on 3001");
});

app.get("GENERATE_ROOM", (req, res) => {
	console.log("Req came");
	res.json({ hi: "hi" });
});
io.on("connection", (socket) => {
	console.log(++count);

	socket.on("disconnect", () => {
		console.log(--count);
	});
});
