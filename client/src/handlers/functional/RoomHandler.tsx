import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useElements } from "../../providers/ElementsProvider";

interface IPeerUser {
	userid: string;
	username: string;
}

// function PeerDrawing({ userid, roomId }: { userid: string; roomId: string }) {
// 	const { elementsArr, setElementsArr } = useElements();
// 	const { socket } = useSocket();

// 	useEffect(() => {
// 		socket.on("incoming_element/" + userid, (element: JSX.Element | null) => {
// 			if (
// 				!element ||
// 				elementsArr.length === 0 ||
// 				!element.key ||
// 				element.key != elementsArr[elementsArr.length - 1].key
// 			)
// 				return;
// 			setElementsArr((p) => [...p, element]);
// 		});
// 	}, []);

// 	return null;
// }

export default function RoomHandler() {
	const { id } = useParams();
	const { socket } = useSocket();

	const username =
		localStorage.getItem("username") ||
		"InstantUser" + (Math.random() * 1000).toFixed();

	const [peers, setPeers] = useState<IPeerUser[]>([]);

	const { elementsArr, setElementsArr, flickerForLocalCreation } =
		useElements();
	// useEffect(() => {
	// 	axios.get(START_SOCKET_SERVER);
	// }, []);
	useEffect(() => {
		if (elementsArr.length) {
			socket.emit("my new element", {
				element: elementsArr[elementsArr.length - 1],
				roomId: id,
			});
			console.log("yes");
		}
	}, [flickerForLocalCreation]);
	useEffect(() => {
		socket.on("incoming_element", (element: JSX.Element) => {
			console.log("came:", element);
			setElementsArr((p) => [...p, element]);
		});
	}, []);

	useEffect(() => {
		console.log(peers);
	}, [peers]);

	useEffect(() => {
		socket.connect();
		socket.emit("i arrived at room", { roomId: id, username });

		socket.on("previous_users", (prevUsers: IPeerUser[]) =>
			setPeers([...peers, ...prevUsers].filter((x) => username !== x.username))
		);
		socket.on("new_user", (userObj: IPeerUser) => {
			if (userObj.username !== username) setPeers([...peers, userObj]);
		});

		return () => {
			socket.disconnect();
		};
	}, []);
	if (!id) return null;
	// return peers.map(({ userid }) => (
	// 	<PeerDrawing key={userid} roomId={id} userid={userid} />
	// ));
	return null;
}
