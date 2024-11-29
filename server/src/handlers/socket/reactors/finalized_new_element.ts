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
	if (!shape) return;
	socket.broadcast
		.to(roomId)
		.emit("incoming_finalized_element", { shape, stagePos, stageScale });

	const prevElements = roomToElementsMap.get(roomId);

	if (!prevElements || !prevElements.length) {
		roomToElementsMap.set(roomId, [{ shape, stagePos, stageScale }]);
		console.log("Elements in " + roomId + ":", 1);
		return;
	}
	if (shape.key === prevElements[prevElements.length - 1].shape.key) return;

	prevElements.push({ shape, stagePos, stageScale });

	console.log("Elements in " + roomId + ":", prevElements.length + 1);
}
