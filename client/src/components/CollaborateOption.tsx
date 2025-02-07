import { useEffect, useState } from "react";
import { GENERATE_ROOM_API } from "../utils/apiRoutes";
import axios from "axios";
import PopUpWrapper from "./PopUpWrapper";
import { BiCopy } from "react-icons/bi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useElements } from "../providers/ElementsProvider";
import { OFFLINE_SHAPES_KEY } from "../utils/constants";

export default function CollaborateOption() {
	const { roomId } = useElements();
	const [roomUrl, setRoomUrl] = useState("");

	const [enteredRoomUrl, setEnteredRoomUrl] = useState("");

	const [show, setShow] = useState(false);

	const [username, setUsername] = useState(
		localStorage.getItem("username") ||
			"User " + (Math.random() * 1000).toFixed()
	);

	const handleCollaborate = async () => {
		toast.loading("Generating a unique room URL...");
		try {
			const { data } = await axios.get(GENERATE_ROOM_API);
			toast.success("Generated a unique room URL");
			setRoomUrl(window.location.href + "room/" + data.roomId);
			setShow(true);
		} catch (error) {
			toast.dismiss();
			toast.error("It seems like the backend server is OFF...");
		}
	};

	useEffect(() => {
		if (!username) return;
		localStorage.setItem("username", username);
	}, [username]);

	useEffect(() => {
		if (window.location.pathname.startsWith("/room/"))
			setRoomUrl(window.location.href);
	}, []);

	return (
		<>
			<button
				className="bg-blue-700 text-white absolute left-4 bottom-4 p-2 z-50 text-sm"
				onClick={handleCollaborate}
				onMouseDown={(e) => e.stopPropagation()}
			>
				{roomId === OFFLINE_SHAPES_KEY ? "Collaborate" : "Change Room"}
			</button>

			{show && (
				<PopUpWrapper setShow={setShow}>
					<div className="flex gap-4 [&>*]:py-2 bg-neutral-800">
						<p className="text-white">Your Username: </p>
						<input
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="text-center flex-1 bg-neutral-100"
						/>
					</div>

					<span className="bg-blue-700 text-white">
						Invite your friends to this link:{" "}
					</span>

					<div
						className="bg-green-300 text-green-950 p-2 rounded-xl flex gap-2 items-center cursor-pointer"
						onClick={() => {
							navigator.clipboard.writeText(roomUrl);
							toast.success("Copied url to clipboard");
						}}
					>
						<p>{roomUrl}</p>
						<BiCopy />
					</div>

					<Link
						className="text-center bg-white text-blue-700 hover:bg-blue-700 hover:text-white"
						to={roomUrl}
						onClick={() => setShow(false)}
					>
						Host Session
					</Link>

					<p className="text-black w-full text-center">OR</p>

					<span className="bg-blue-700 text-white">
						Join your friend's room:{" "}
					</span>

					<div className="flex gap-4 [&>*]:py-2 w-full">
						<p>Enter url: </p>

						<input
							className="px-3 flex-1"
							value={enteredRoomUrl}
							onChange={(e) => setEnteredRoomUrl(e.target.value)}
							placeholder="Ask your friend"
						/>
					</div>

					<Link
						className="text-center bg-white text-blue-700 hover:bg-blue-700 hover:text-white"
						to={enteredRoomUrl}
						onClick={() => setShow(false)}
					>
						Join Session
					</Link>
				</PopUpWrapper>
			)}
		</>
	);
}
