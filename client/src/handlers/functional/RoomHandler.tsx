import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";

export default function RoomHandler() {
	const { id } = useParams();
	const { socket } = useSocket();
	useEffect(() => {
		socket.connect();
		socket.emit("i arrived at room", id);

		return () => {
			socket.disconnect();
		};
	}, []);
	return null;
}
