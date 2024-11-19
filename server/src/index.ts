import { Server } from "socket.io";

const io = new Server({ cors: { origin: "*" } });
io.listen(3000);
console.log("Socket running on 3000");

let count = 0;
io.on("connection", (socket) => {
	console.log(++count);

	socket.on("disconnect", () => {
		console.log(--count);
	});
});
