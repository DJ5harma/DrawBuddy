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
import { IElement, IPeers } from "../../utils/types";
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

	const {
		elementsArrRef,
		addElementToStage,
		setMainElements,
		updateProject,
		projectId,
		removeElementFromStage,
		latestDeletedKeyRef,
	} = useElements();

	const { myNewElement } = useMyNewElement();
	const [peers, setPeers] = useState<IPeers>({});
	const { stageScale } = useStage();

	useEffect(() => {
		if (elementsArrRef.current.length && !myNewElement) {
			socket.emit("finalized_new_element", {
				element: elementsArrRef.current[elementsArrRef.current.length - 1],
				roomId,
			});
		}
		socket.emit("creating_new_element", {
			element: myNewElement
				? serializeKonvaElement(myNewElement)
				: myNewElement,
			roomId,
		});
	}, [myNewElement]);
	useEffect(() => {
		if (latestDeletedKeyRef.current) {
			socket.emit("removed_element", {
				key: latestDeletedKeyRef.current,
				roomId,
			});
		}
	}, [latestDeletedKeyRef.current]);

	useEffect(() => {
		if (roomId && projectId !== roomId) {
			updateProject(roomId);
			return;
		}

		socket.emit("i_arrived_at_room", {
			roomId,
			username,
		});

		socket.on("previous_users", (prevUsers: IPeers) => {
			setPeers(prevUsers);
			toast(`Joined in a room with ${Object.keys(prevUsers).length} other(s)`);
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

		socket.on(
			"incoming_finalized_element",
			({ element }: { element: IElement }) => {
				if (element) addElementToStage(element);
			}
		);

		socket.on("incoming_removed_element", ({ key }: { key: string }) => {
			if (key) removeElementFromStage(key, true);
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
		socket.on("update_elements", (elements: IElement[]) =>
			setMainElements(elements)
		);
		return () => {
			socket.removeAllListeners();
		};
	}, [projectId]);

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
					x={x + 10 / stageScale}
					y={y + 10 / stageScale}
					scaleX={1 / stageScale}
					scaleY={1 / stageScale}
					height={10}
				/>
			</Group>
		);
	});
}
