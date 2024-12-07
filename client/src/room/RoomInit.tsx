import { useParams } from "react-router-dom";
import { useElements } from "../providers/ElementsProvider";
import { useSocket } from "../providers/SocketProvider";
import { useEffect } from "react";
import { OFFLINE_SHAPES_KEY } from "../utils/constants";

export default function RoomInit() {
	const { id: roomId } = useParams();

	const { setRoomId } = useElements();

	const { socket, switchSocket } = useSocket();

	const username = (() => {
		const x = localStorage.getItem("username");
		if (x) return x;
		const newName = "InstantUser " + (Math.random() * 1000).toFixed();
		localStorage.setItem("username", newName);
		return newName;
	})();

	useEffect(() => {
		switchSocket(true).then(() => {
			socket.emit("i_arrived_at_room", {
				roomId,
				username,
			});
			setRoomId(roomId || OFFLINE_SHAPES_KEY);
		});
	}, []);

	return null;
}
