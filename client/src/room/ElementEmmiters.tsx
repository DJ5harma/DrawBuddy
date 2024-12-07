import { useParams } from "react-router-dom";
import { useElements } from "../providers/ElementsProvider";
import { useMyNewElement } from "../providers/MyNewElementProvider";
import { useSocket } from "../providers/SocketProvider";
import { useEffect } from "react";
import { serializeKonvaElement } from "../utils/konva/convertKonva";

export default function ElementEmitters() {
	const { id: roomId } = useParams();

	const { latestDeletedKeyRef } = useElements();

	const { myNewElement, preparedMyNewElementRef } = useMyNewElement();

	const { socket } = useSocket();

	useEffect(() => {
		socket.emit("creating_new_element", {
			element: myNewElement
				? serializeKonvaElement(myNewElement)
				: myNewElement,
			roomId,
		});
	}, [myNewElement]);

	useEffect(() => {
		if (preparedMyNewElementRef.current) {
			socket.emit("finalized_new_element", {
				element: preparedMyNewElementRef.current,
				roomId,
			});
		}
	}, [preparedMyNewElementRef.current]);

	useEffect(() => {
		if (latestDeletedKeyRef.current)
			socket.emit("removed_element", {
				key: latestDeletedKeyRef.current,
				roomId,
			});
	}, [latestDeletedKeyRef.current]);

	return null;
}
