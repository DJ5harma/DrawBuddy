import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useElements } from "../../providers/ElementsProvider";
import { serializeKonvaElement } from "../../utils/konva/convertKonva";
import toast from "react-hot-toast";
import { IPeers } from "../../utils/types";

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
		socket.emit("i arrived at room", { roomId, username });
		socket.on("previous_users", (prevUsers: IPeers) => {
			setPeers(prevUsers);
			toast(`Joined in a room with ${Object.keys(prevUsers).length} other(s)`);
			console.log(prevUsers);
		});

		socket.on("new_user", (userObj: { userid: string; username: string }) => {
			setPeers((p) => {
				p[userObj.userid] = { tempElement: null, username: userObj.username };
				return p;
			});
			toast(userObj.username + " joined!");
			console.log({ userObj });
		});

		socket.on("incoming finalized element", (element: JSX.Element) => {
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
			socket.removeAllListeners();
		};
	}, []);
	return null;
}
