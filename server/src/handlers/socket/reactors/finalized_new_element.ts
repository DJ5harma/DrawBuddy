import { Socket } from "socket.io";
import { roomToElementsMap } from "../../../cache";
import { IElement } from "../../../utils/types";

export default function finalized_new_element(
	socket: Socket,
	{ roomId, element }: { roomId: string; element: IElement }
) {
	if (!element || !roomId) return;

	socket.broadcast.to(roomId).emit("incoming_finalized_element", { element });

	const prevElemMap = roomToElementsMap.get(roomId);
	if (!prevElemMap) return;
	prevElemMap.set(element.shape.key, element);

	console.log("Elements in " + roomId + ":", prevElemMap.size);
}
