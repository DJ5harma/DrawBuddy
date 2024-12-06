import {
	io,
	roomToUsersMap,
	socketCache,
	useridToRoomMap,
} from "../../../cache";
import { SOCKET_CLOSE_TIMEOUT } from "../../../utils/constants";

export default function close_socket_server() {
	if (socketCache.clients > 0 || socketCache.startedToClose) return;

	socketCache.startedToClose = true;

	console.log("Started to close socket server");

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
	}, SOCKET_CLOSE_TIMEOUT);
}
