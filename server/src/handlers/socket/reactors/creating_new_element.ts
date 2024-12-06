import { Socket } from "socket.io";
import { IElement } from "../../../utils/types";

export default function creating_new_element(
	socket: Socket,
	{ element, roomId }: { element: IElement; roomId: string }
) {
	if (!roomId) return;

	socket.broadcast
		.to(roomId)
		.emit("incoming_element_in_making", { element, userid: socket.id });
}
