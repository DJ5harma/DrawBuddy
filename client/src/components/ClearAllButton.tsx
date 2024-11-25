import { MdOutlineDelete } from "react-icons/md";
import { useElements } from "../providers/ElementsProvider";
import { useSocket } from "../providers/SocketProvider";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useMyNewElement } from "../providers/MyNewElementProvider";

export default function ClearAllButton() {
	const { id: roomId } = useParams();
	const { setMainElements } = useElements();

	const { setMyNewElement } = useMyNewElement();

	const { socket } = useSocket() as { socket: Socket | null };

	return (
		<button
			onClick={() => {
				setMainElements([]);
				setMyNewElement(null);
				if (socket) socket.emit("clear all elements", { roomId });
			}}
			className="absolute p-2 bottom-4 right-4 z-10 hover:bg-neutral-700 bg-neutral-800"
		>
			<MdOutlineDelete size={25} />
		</button>
	);
}
