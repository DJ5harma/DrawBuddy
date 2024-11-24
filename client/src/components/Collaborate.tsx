import { useEffect, useState } from "react";
import { GENERATE_ROOM_API } from "../utils/apiRoutes";
import axios from "axios";
import PopUpWrapper from "../wrappers/PopUpWrapper";
import { BiCopy } from "react-icons/bi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Collaborate() {
	const [roomUrl, setRoomUrl] = useState("");
	const [show, setShow] = useState(false);

	const [username, setUsername] = useState(
		localStorage.getItem("username") ||
			"User " + (Math.random() * 1000).toFixed()
	);

	const handleCollaborate = async () => {
		const { data } = await axios.get(GENERATE_ROOM_API);
		setRoomUrl(window.location.href + "room/" + data.roomId);
		setShow(true);
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
				className="bg-blue-700 text-white absolute left-4 bottom-4 p-3"
				onClick={handleCollaborate}
			>
				Collaborate
			</button>
			{show && (
				<PopUpWrapper setShow={setShow}>
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
					<p>Join as..</p>
					<input
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<Link
						className="text-center bg-white text-blue-700 hover:bg-blue-700 hover:text-white"
						to={roomUrl}
					>
						Start Session
					</Link>
				</PopUpWrapper>
			)}
		</>
	);
}
