import { useState } from "react";
import PopUpWrapper from "../wrappers/PopUpWrapper";
import { BiMenu } from "react-icons/bi";

export default function NavMenu() {
	const [show, setShow] = useState(false);
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
					<p className="bg-blue-700 text-white">Collaborate</p>
					<button>Button 2</button>
					<button>Button 3</button>
					<button>Button 4</button>
				</PopUpWrapper>
			)}
		</>
	);
}
