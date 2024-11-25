import { Socket } from "socket.io";
import {
	roomToElementsMap,
	roomToUsersMap,
	useridToRoomMap,
} from "../../../cache";

export default function i_arrived_at_room(
	socket: Socket,
	{
		roomId,
		username,
		havingElements,
	}: { roomId: string; username: string; havingElements: number }
) {
	console.log(socket.id, " arrived");

	const userObj = { userid: socket.id, username };
	socket.broadcast.to(roomId).emit("new_user", userObj);

	const prevUsers = roomToUsersMap.get(roomId) || {};
	socket.broadcast.to(roomId).emit("previous_users", prevUsers);
	prevUsers[socket.id] = { username, tempElement: null };

	if (!havingElements) {
		console.log("sent prev elements", { havingElements });
		socket.emit("update_elements", roomToElementsMap.get(roomId) || []);
	}

	roomToUsersMap.set(roomId, prevUsers);

	console.log({ prevUsers });

	socket.join(roomId);

	useridToRoomMap.set(socket.id, roomId);
}
