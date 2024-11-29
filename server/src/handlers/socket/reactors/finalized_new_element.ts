import { Socket } from "socket.io";
import { roomToElementsMap } from "../../../cache";
import { IPoint, IShape } from "../../../utils/types";

export default function finalized_new_element(
	socket: Socket,
	{
		shape,
		roomId,
		stagePos,
		stageScale,
	}: { shape: IShape; roomId: string; stagePos: IPoint; stageScale: number }
) {
	socket.broadcast
		.to(roomId)
		.emit("incoming_finalized_element", { shape, stagePos, stageScale });
	// console.log("incoming finalizing element: ", element);

	const prevElements = roomToElementsMap.get(roomId) || [];
	if (
		!shape ||
		(prevElements.length &&
			shape.key === prevElements[prevElements.length - 1].shape.key)
	)
		return;
	prevElements.push({ shape, stagePos, stageScale });
	roomToElementsMap.set(roomId, prevElements);

	console.log("Elements in " + roomId + ": ", prevElements.length + 1);
}
