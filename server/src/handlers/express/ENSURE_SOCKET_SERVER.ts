import { Router } from "express";
import { socketCache } from "../../cache";
import start_socket_server from "../socket/switch/start_socket_server";
import close_socket_server from "../socket/switch/close_socket_server";

const router = Router();

router.get("/ENSURE_SOCKET_SERVER", (_, res) => {
	console.log("Socket Server opening requested");
	const previouslyClosed = socketCache.closed;
	start_socket_server();

	res
		.status(200)
		.send(
			previouslyClosed
				? "Turned the socket server on..."
				: "Socket server is already on..."
		);

	close_socket_server();
});

export default router;
