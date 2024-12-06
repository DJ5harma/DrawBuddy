import { Socket } from "socket.io";
import { roomToElementsMap } from "../../../cache";

export default function removed_element(
	socket: Socket,
	{ key, roomId }: { key: string; roomId: string }
) {
	if (!key || !roomId) return;
	socket.broadcast.to(roomId).emit("incoming_removed_element", { key });

	const prevElements = roomToElementsMap.get(roomId) || [];
	roomToElementsMap.set(
		roomId,
		prevElements.filter(({ shape }) => shape.key !== key)
	);
	console.log("Elements in " + roomId + ":", prevElements.length);
}
