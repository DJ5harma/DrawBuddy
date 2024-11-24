import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { IPeers, useElements } from "../../providers/ElementsProvider";
import { serializeKonvaElement } from "../../utils/konva/convertKonva";
import axios from "axios";
import { START_SOCKET_SERVER_API } from "../../utils/apiRoutes";
import toast from "react-hot-toast";

export default function RoomHandler() {
	const { id: roomId } = useParams();
	const { socket } = useSocket();

	const username = (() => {
		const x = localStorage.getItem("username");
		if (x) return x;
		const newName = "InstantUser " + (Math.random() * 1000).toFixed();
		localStorage.setItem("username", newName);
		return newName;
	})();

	const {
		elementsArr,
		setElementsArr,
		flickerForLocalCreation,
		setPeers,
		myNewElement,
	} = useElements();

	useEffect(() => {
		socket.emit("creating new element", {
			element: myNewElement ? serializeKonvaElement(myNewElement) : null,
			roomId,
		});
	}, [myNewElement]);

	useEffect(() => {
		if (elementsArr.length)
			socket.emit("finalized new element", {
				element: elementsArr[elementsArr.length - 1],
				roomId,
			});
	}, [flickerForLocalCreation]);

	useEffect(() => {
		axios.get(START_SOCKET_SERVER_API).then(() => socket.connect());
		socket.on("connection", () => {
			toast.success("Socket server connected!");
			socket.emit("i arrived at room", { roomId, username });
		});
		socket.on("previous_users", (prevUsers: IPeers) => {
			setPeers(prevUsers);
			toast(`Joined in a room with ${Object.keys(prevUsers).length} other(s)`);
		});

		socket.on("new_user", (userObj: IPeers[string]) => {
			setPeers((p) => ({ ...p, userObj }));
			toast(userObj.username + " joined!");
		});

		socket.on("incoming finalized element", (element: JSX.Element) => {
			console.log("came:", element);
			setElementsArr((p) => [...p, element]);
		});

		socket.on(
			"incoming element in making",
			({
				element,
				userid,
			}: {
				element: JSX.Element | null;
				userid: string;
			}) => {
				setPeers((p) => ({
					...p,
					[userid]: { ...p[userid], tempElement: element },
				}));
			}
		);
		return () => {
			socket.disconnect();
		};
	}, []);
	return null;
}
