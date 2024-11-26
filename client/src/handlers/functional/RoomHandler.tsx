import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useElements } from "../../providers/ElementsProvider";
import {
	deserializeKonvaElement,
	getShapeEnds,
	serializeKonvaElement,
} from "../../utils/konva/convertKonva";
import toast from "react-hot-toast";
import { IPeers } from "../../utils/types";
import { useMyNewElement } from "../../providers/MyNewElementProvider";
import { Circle, Group, Text } from "react-konva";
import { useStage } from "../../providers/StageProvider";

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

	const { elementsArrRef, addElementToStage, setMainElements } = useElements();

	const { myNewElement } = useMyNewElement();
	const [peers, setPeers] = useState<IPeers>({});

	useEffect(() => {
		socket.emit("creating_new_element", {
			element: myNewElement ? serializeKonvaElement(myNewElement) : null,
			roomId,
		});
		if (!myNewElement && elementsArrRef.current.length)
			socket.emit("finalized_new_element", {
				element: serializeKonvaElement(
					elementsArrRef.current[elementsArrRef.current.length - 1]
				),
				roomId,
			});
	}, [myNewElement]);

	useEffect(() => {
		socket.emit("i_arrived_at_room", {
			roomId,
			username,
			havingElements: elementsArrRef.current.length,
		});

		socket.on("previous_users", (prevUsers: IPeers) => {
			setPeers(prevUsers);
			toast(`Joined in a room with ${Object.keys(prevUsers).length} other(s)`);
			console.log(prevUsers);
		});

		socket.on(
			"new_user",
			(userObj: { userid: string; username: string; usercolor: string }) => {
				setPeers((p) => {
					p[userObj.userid] = {
						tempElement: null,
						username: userObj.username,
						usercolor: userObj.usercolor,
					};
					return p;
				});
				toast(userObj.username + " joined!");
			}
		);
		socket.on("user_left", (userid) => {
			setPeers((p) => {
				if (!p[userid]) return p;
				toast(p[userid].username + " left the room");
				delete p[userid];
				return p;
			});
		});

		socket.on("update_elements", (prevElements: JSX.Element[]) => {
			setMainElements(
				prevElements.map((elem) => deserializeKonvaElement(elem))
			);
		});
		socket.on("incoming_finalized_element", (element: JSX.Element) => {
			addElementToStage(deserializeKonvaElement(element));
		});
		socket.on(
			"incoming_element_in_making",
			({
				element,
				userid,
			}: {
				element: JSX.Element | null;
				userid: string;
			}) => {
				setPeers((p) => ({
					...p,
					[userid]: {
						...p[userid],
						tempElement: element ? deserializeKonvaElement(element) : null,
					},
				}));
			}
		);
		return () => {
			socket.removeAllListeners();
		};
	}, []);

	const { stageScale } = useStage();

	return Object.keys(peers).map((userid) => {
		const { username, tempElement, usercolor } = peers[userid];
		if (!tempElement) return null;
		const { x, y } = getShapeEnds(tempElement);
		return (
			<Group key={userid}>
				{tempElement}
				<Circle radius={10 / stageScale} fill={usercolor} x={x} y={y} />
				<Text
					text={username}
					fill={"white"}
					x={x}
					y={y}
					scaleX={1 / stageScale}
					scaleY={1 / stageScale}
					height={10}
				/>
			</Group>
		);
	});
}
