import { Socket } from "socket.io";
import { roomToUsersMap, useridToRoomMap } from "../../../cache";

function randomColor() {
	const randomColorVal = () => (Math.random() * 155 + 100).toFixed();
	return (
		"rgb(" +
		randomColorVal() +
		", " +
		randomColorVal() +
		", " +
		randomColorVal() +
		")"
	);
}

export default function i_arrived_at_room(
	socket: Socket,
	{
		roomId,
		username,
	}: {
		roomId: string;
		username: string;
	}
) {
	if (!roomId) return;

	const userObj = { userid: socket.id, username, usercolor: randomColor() };

	socket.broadcast.to(roomId).emit("new_user", userObj);

	const prevUsers = roomToUsersMap.get(roomId) || {};

	socket.emit("previous_users", prevUsers);
	socket.join(roomId);

	prevUsers[socket.id] = { username, usercolor: randomColor() };

	roomToUsersMap.set(roomId, prevUsers);

	useridToRoomMap.set(socket.id, roomId);
}
