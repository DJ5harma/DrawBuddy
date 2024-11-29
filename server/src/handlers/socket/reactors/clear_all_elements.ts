import { Socket } from "socket.io";
import { roomToElementsMap } from "../../../cache";

export default function clear_all_elements(
	socket: Socket,
	{ roomId }: { roomId: string }
) {
	roomToElementsMap.delete(roomId);
	socket.broadcast.to(roomId).emit("update_elements", []);
}