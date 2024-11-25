import { Socket } from "socket.io";
import { roomToUsersMap, socketCache, useridToRoomMap } from "../../../cache";
import { close_socket_server } from "../switch";

export default function disconnect(socket: Socket) {
	console.log(--socketCache.clients);

	const roomId = useridToRoomMap.get(socket.id);

	if (roomId) {
		useridToRoomMap.delete(socket.id);

		let prevUsers = roomToUsersMap.get(roomId);
		if (prevUsers) {
			delete prevUsers[socket.id];
			roomToUsersMap.set(roomId, prevUsers);
		}
		socket.broadcast.to(roomId).emit("user_left", socket.id);
	}
	close_socket_server();
}
