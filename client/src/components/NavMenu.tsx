import { useState } from "react";
import PopUpWrapper from "../wrappers/PopUpWrapper";
import { BiMenu } from "react-icons/bi";

export default function NavMenu() {
	const [show, setShow] = useState(false);
	return (
		<>
			<button
				onClick={() => setShow(!show)}
				onMouseDown={(e) => e.stopPropagation()}
				className={"absolute p-2 top-4 left-4 z-50 hover:bg-neutral-700"}
			>
				<BiMenu size={30} />
			</button>
			{show && (
				<PopUpWrapper setShow={setShow} className="">
					<button>Button 2</button>
					<button>Button 3</button>
					<button>Button 4</button>
				</PopUpWrapper>
			)}
		</>
	);
}
