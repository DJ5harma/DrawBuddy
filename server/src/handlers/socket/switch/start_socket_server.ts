import { io, socketCache } from "../../../cache";
import { SOCKET_PORT } from "../../../utils/constants";

export default function start_socket_server() {
	if (!socketCache.closed) return;
	io.listen(SOCKET_PORT);
	socketCache.closed = false;

	console.log("Socket server running on " + SOCKET_PORT);
}
