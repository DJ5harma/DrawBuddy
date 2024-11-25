import { io, roomToUsersMap, socketCache, useridToRoomMap } from "../../cache";

export function start_socket_server() {
	if (!socketCache.closed) return;
	io.listen(3000);
	socketCache.closed = false;
	console.log("Socket running at 3000");
}

export function close_socket_server() {
	if (socketCache.clients > 0 || socketCache.startedToClose) return;
	socketCache.startedToClose = true;
	console.log("Started to close wss", socketCache.clients);

	setTimeout(() => {
		if (!socketCache.clients) {
			io.close();
			socketCache.closed = true;
			socketCache.startedToClose = false;
			console.log("Socket server closed");
			roomToUsersMap.clear();
			useridToRoomMap.clear();
		} else {
			console.log("Didn't close");
			socketCache.startedToClose = false;
		}
	}, 20000);
}
