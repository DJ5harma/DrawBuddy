import { Socket } from "socket.io";
import { roomToElementsMap } from "../../../cache";
import { IElement } from "../../../utils/types";

export default function finalized_new_element(
	socket: Socket,
	{ roomId, element }: { roomId: string; element: IElement }
) {
	if (!element || !roomId) return;
	socket.broadcast.to(roomId).emit("incoming_finalized_element", { element });

	const prevElements = roomToElementsMap.get(roomId);

	if (!prevElements || !prevElements.length) {
		roomToElementsMap.set(roomId, [element]);
		console.log("Elements in " + roomId + ":", 1);
		return;
	}
	if (element.shape.key === prevElements[prevElements.length - 1].shape.key)
		return;

	prevElements.push(element);

	console.log("Elements in " + roomId + ":", prevElements.length);
}
