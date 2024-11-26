import { Socket } from "socket.io";
import { roomToElementsMap } from "../../../cache";

export default function finalized_new_element(
	socket: Socket,
	{ element, roomId }: { element: string; roomId: string }
) {
	socket.broadcast.to(roomId).emit("incoming_finalized_element", element);

	const prevElements = roomToElementsMap.get(roomId) || [];

	roomToElementsMap.set(roomId, [...prevElements, element]);
}
