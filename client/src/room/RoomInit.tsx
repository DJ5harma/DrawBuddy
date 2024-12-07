import { useParams } from "react-router-dom";
import { useElements } from "../providers/ElementsProvider";
import { useSocket } from "../providers/SocketProvider";
import { useEffect } from "react";

export default function RoomInit() {
	const { id: roomId } = useParams();

	const { projectId } = useElements();

	const { socket } = useSocket();

	const username = (() => {
		const x = localStorage.getItem("username");
		if (x) return x;
		const newName = "InstantUser " + (Math.random() * 1000).toFixed();
		localStorage.setItem("username", newName);
		return newName;
	})();

	useEffect(() => {
		socket.emit("i_arrived_at_room", {
			roomId,
			username,
		});
	}, [projectId]);

	return null;
}
