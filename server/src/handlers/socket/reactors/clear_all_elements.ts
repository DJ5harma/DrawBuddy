import { Socket } from "socket.io";
import { roomToElementsMap } from "../../../cache";

export default function clear_all_elements(
	socket: Socket,
	{ roomId }: { roomId: string }
) {
	if (!roomId) return;

	roomToElementsMap.set(roomId, new Map());

	socket.broadcast.to(roomId).emit("update_elements", []);
}
