import { useParams } from "react-router-dom";
import { useElements } from "../providers/ElementsProvider";
import { useSocket } from "../providers/SocketProvider";
import { useStage } from "../providers/StageProvider";
import { useEffect, useState } from "react";
import { IElement, IPeers } from "../utils/types";
import toast from "react-hot-toast";
import {
	deserializeKonvaElement,
	getShapeEnds,
} from "../utils/konva/convertKonva";
import { Circle, Group, Text } from "react-konva";

export default function ElementListeners() {
	const { id: roomId } = useParams();

	const {
		addElementToStage,
		setMainElements,
		updateProject,
		projectId,
		removeElementFromStage,
	} = useElements();

	const { socket } = useSocket();

	const { stageScale } = useStage();

	const [peers, setPeers] = useState<IPeers>({});

	useEffect(() => {
		if (roomId && projectId !== roomId) {
			updateProject(roomId);
			return;
		}

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

		socket.on("user_left", (userid) =>
			setPeers((p) => {
				if (!p[userid]) return p;
				toast(p[userid].username + " left the room");
				delete p[userid];
				return p;
			})
		);

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
			({ element, userid }: { element: JSX.Element | null; userid: string }) =>
				setPeers((p) => ({
					...p,
					[userid]: {
						...p[userid],
						tempElement: element ? deserializeKonvaElement(element) : null,
					},
				}))
		);

		socket.on("update_elements", (elements: [string, IElement][]) =>
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
