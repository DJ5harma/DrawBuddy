import { useEffect, useState } from "react";
import PopUpWrapper from "../wrappers/PopUpWrapper";
import { BiMenu } from "react-icons/bi";
import axios from "axios";
import { GENERATE_ROOM_API } from "../utils/apiRoutes";

type IMenuMode = "Main" | "Collaborate";

export default function NavMenu() {
	const [show, setShow] = useState(false);

	const [menuMode, setMenuMode] = useState<IMenuMode>("Main");

	const [username, setUsername] = useState(
		localStorage.getItem("username") ||
			"User " + (Math.random() * 1000).toFixed()
	);
	useEffect(() => {
		if (!username) return;
		localStorage.setItem("username", username);
	}, [username]);

	const handleCollaborate = async () => {
		const res = await axios.get(GENERATE_ROOM_API);
		// setMenuMode("Collaborate");
		console.log(res.data);
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
					className="[&>*]:px-4 [&>*]:py-3 [&>*]:cursor-pointer [&>button]:bg-white text-blue-900 bg-gray-300 font-semibold"
				>
					{menuMode === "Main" && (
						<>
							<p className="bg-blue-700 text-white" onClick={handleCollaborate}>
								Collaborate
							</p>
							<button>Button 2</button>
							<button>Button 3</button>
							<button>Button 4</button>
						</>
					)}
					{menuMode === "Collaborate" && (
						<>
							<p className="bg-blue-700 text-white">
								Invite your friends to this link:{" "}
							</p>
							<p>Join as..</p>
							<input
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
							<button>Start Session</button>
						</>
					)}
				</PopUpWrapper>
			)}
		</>
	);
}
