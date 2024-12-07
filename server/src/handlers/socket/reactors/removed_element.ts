import { Socket } from "socket.io";
import { roomToElementsMap } from "../../../cache";

export default function removed_element(
	socket: Socket,
	{ key, roomId }: { key: string; roomId: string }
) {
	if (!key || !roomId) return;

	socket.broadcast.to(roomId).emit("incoming_removed_element", { key });

	const prevElemMap = roomToElementsMap.get(roomId);

	if (!prevElemMap) return;

	prevElemMap.delete(key);

	console.log("Elements in " + roomId + ":", prevElemMap.size);
}
