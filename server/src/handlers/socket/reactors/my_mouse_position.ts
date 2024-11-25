import { Socket } from "socket.io";
import { roomToElementsMap } from "../../../cache";

export default function my_mouse_position(
	socket: Socket,
	{ mousePos, roomId }: { mousePos: { x: number; y: number }; roomId: string }
) {
	socket.broadcast
		.to(roomId)
		.emit("incoming_peer_mouse_position", { mousePos, userid: socket.id });
}
