import { Socket } from "socket.io";
import { roomToElementsMap } from "../../../cache";
import { IElement } from "../../../types";

export default function finalized_new_element(
	socket: Socket,
	{ element, roomId }: { element: IElement; roomId: string }
) {
	socket.broadcast.to(roomId).emit("incoming_finalized_element", element);

	const prevElements = roomToElementsMap.get(roomId) || [];
	if (
		prevElements.length &&
		element.key === prevElements[prevElements.length - 1].key
	)
		return;
	prevElements.push(element);
	roomToElementsMap.set(roomId, prevElements);

	console.log("Elements in " + roomId + ": ", prevElements.length + 1);
}
