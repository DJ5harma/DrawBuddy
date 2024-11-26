import { useState } from "react";
import PopUpWrapper from "../wrappers/PopUpWrapper";
import { BiMenu } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function NavMenu() {
	const [show, setShow] = useState(false);
	return (
		<>
			<button
				onClick={() => setShow(!show)}
				onMouseDown={(e) => e.stopPropagation()}
				className="absolute p-2 top-4 left-4 z-50 hover:bg-neutral-700 bg-neutral-800"
			>
				<BiMenu size={30} />
			</button>
			{show && (
				<PopUpWrapper setShow={setShow} className="[&>*]:text-center">
					<Link
						to="/"
						className="bg-white text-blue-700 hover:bg-blue-700 hover:text-white"
						onClick={() => setShow(false)}
					>
						Home
					</Link>
					<button>Button 3</button>
					<button>Button 4</button>
				</PopUpWrapper>
			)}
		</>
	);
}
