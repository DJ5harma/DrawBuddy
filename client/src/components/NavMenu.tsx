import { useEffect, useState } from "react";
import PopUpWrapper from "../wrappers/PopUpWrapper";
import { BiCopy, BiMenu } from "react-icons/bi";
import axios from "axios";
import { GENERATE_ROOM_API } from "../utils/apiRoutes";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

type IMenuMode = "Main" | "Collaborate";

export default function NavMenu() {
	const [show, setShow] = useState(false);

	const [menuMode, setMenuMode] = useState<IMenuMode>("Main");

	const [username, setUsername] = useState(
		localStorage.getItem("username") ||
			"User " + (Math.random() * 1000).toFixed()
	);
	const [roomUrl, setRoomUrl] = useState("");

	useEffect(() => {
		if (!username) return;
		localStorage.setItem("username", username);
	}, [username]);

	useEffect(() => {
		if (window.location.pathname.startsWith("/room/"))
			setRoomUrl(window.location.href);
	}, []);

	const handleCollaborate = async () => {
		const { data } = await axios.get(GENERATE_ROOM_API);
		setRoomUrl(window.location.href + "room/" + data.roomId);
		setMenuMode("Collaborate");
	};
	return (
		<>
			<BiMenu
				className="absolute top-4 left-4 z-50 cursor-pointer bg-black"
				size={30}
				onClick={() => setShow(!show)}
				onMouseDown={(e) => e.stopPropagation()}
			/>
			{show && (
				<PopUpWrapper
					setShow={setShow}
					className="[&>*]:px-4 [&>*]:py-3 [&>p]:cursor-pointer [&>button]:bg-white text-blue-900 bg-gray-300 font-semibold"
				>
					{menuMode === "Main" && (
						<>
							{!roomUrl && (
								<p
									className="bg-blue-700 text-white"
									onClick={handleCollaborate}
								>
									Collaborate
								</p>
							)}
							<button>Button 2</button>
							<button>Button 3</button>
							<button>Button 4</button>
						</>
					)}
					{menuMode === "Collaborate" && (
						<>
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
								onClick={() => setMenuMode("Main")}
							>
								Start Session
							</Link>
						</>
					)}
				</PopUpWrapper>
			)}
		</>
	);
}
