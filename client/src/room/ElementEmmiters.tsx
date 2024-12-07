import { useParams } from "react-router-dom";
import { useElements } from "../providers/ElementsProvider";
import { useMyNewElement } from "../providers/MyNewElementProvider";
import { useSocket } from "../providers/SocketProvider";
import { useEffect, useRef } from "react";
import { serializeKonvaElement } from "../utils/konva/convertKonva";

export default function ElementEmitters() {
	const { id: roomId } = useParams();

	const { elementsRef, latestDeletedKeyRef } = useElements();

	const { myNewElement } = useMyNewElement();

	const { socket } = useSocket();

	const makingElementKeyRef = useRef<string | null>(null);

	useEffect(() => {
		if (makingElementKeyRef.current) {
			socket.emit("finalized_new_element", {
				element: elementsRef.current.get(makingElementKeyRef.current),
				roomId,
			});
		}

		makingElementKeyRef.current = myNewElement ? myNewElement.key : null;

		socket.emit("creating_new_element", {
			element: myNewElement
				? serializeKonvaElement(myNewElement)
				: myNewElement,
			roomId,
		});
	}, [myNewElement]);

	useEffect(() => {
		if (latestDeletedKeyRef.current)
			socket.emit("removed_element", {
				key: latestDeletedKeyRef.current,
				roomId,
			});
	}, [latestDeletedKeyRef.current]);

	return null;
}
