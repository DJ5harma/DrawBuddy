import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useStage } from "../../providers/StageProvider";

interface IPeerMousePositions {
	[userid: string]: { x: number; y: number };
}

export default function RoomPointersHandler() {
	const { id: roomId } = useParams();
	const { socket } = useSocket();

	const { getMousePos, revertMousePos } = useStage();

	const [peerMousePositions, setPeerMousePositions] =
		useState<IPeerMousePositions>({});

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const { x, y } = getMousePos(e.clientX, e.clientY);
			const mousePos = { x, y };
			socket.emit("my mouse position", {
				mousePos,
				roomId,
			});
		};
		socket.on(
			"incoming peer mouse position",
			({
				mousePos,
				userid,
			}: {
				mousePos: { x: number; y: number };
				userid: string;
			}) => {
				setPeerMousePositions((p) => ({ ...p, [userid]: mousePos }));
			}
		);
		document.addEventListener("mousemove", handleMouseMove);
		return () => {
			socket.removeAllListeners();
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);
	return Object.keys(peerMousePositions).map((userid) => {
		const mousePos = peerMousePositions[userid];
		const { x, y } = revertMousePos(mousePos.x, mousePos.y);
		return (
			<div
				key={userid}
				className="w-4 h-4 bg-red-700 p-2 absolute"
				style={{ left: x, top: y }}
			></div>
		);
	});
}
