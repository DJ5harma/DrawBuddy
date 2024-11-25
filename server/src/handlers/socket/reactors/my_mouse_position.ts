import { Socket } from "socket.io";

export default function my_mouse_position(
	socket: Socket,
	{ mousePos, roomId }: { mousePos: unknown; roomId: string }
) {
	socket.broadcast
		.to(roomId)
		.emit("incoming_peer_mouse_position", { mousePos, userid: socket.id });
}
