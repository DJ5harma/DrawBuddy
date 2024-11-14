import { ReactNode, useState } from "react";
import { IconType } from "react-icons";
import { BiPencil } from "react-icons/bi";
import { FaMousePointer } from "react-icons/fa";
import { FaArrowRightLong, FaHand } from "react-icons/fa6";
import { FiCircle } from "react-icons/fi";
import { ImTextColor } from "react-icons/im";
import { LuDiamond, LuEraser, LuRectangleHorizontal } from "react-icons/lu";
import { MdOutlineHorizontalRule } from "react-icons/md";
import { RiGalleryLine } from "react-icons/ri";

type ISelectedTool =
	| "Pointer"
	| "Hand"
	| "Rectangle"
	| "Diamond"
	| "Circle"
	| "Arrow"
	| "Line"
	| "Pencil"
	| "Text"
	| "Gallery"
	| "Eraser";

const toolArr: { name: ISelectedTool; icon: ReactNode }[] = [
	{
		name: "Hand",
		icon: <FaHand />,
	},
	{
		name: "Pointer",
		icon: <FaMousePointer />,
	},
	{
		name: "Rectangle",
		icon: <LuRectangleHorizontal />,
	},
	{
		name: "Diamond",
		icon: <LuDiamond />,
	},
	{
		name: "Circle",
		icon: <FiCircle />,
	},
	{
		name: "Arrow",
		icon: <FaArrowRightLong />,
	},
	{
		name: "Line",
		icon: <MdOutlineHorizontalRule />,
	},
	{
		name: "Pencil",
		icon: <BiPencil />,
	},
	{
		name: "Text",
		icon: <ImTextColor />,
	},
	{
		name: "Gallery",
		icon: <RiGalleryLine />,
	},
	{
		name: "Eraser",
		icon: <LuEraser />,
	},
];
export default function TopNav() {
	const [selected, setSelected] = useState<ISelectedTool>("Rectangle");

	return (
		<div className="w-screen absolute top-4 left-0 flex justify-center items-center z-10">
			<nav className="top-2 bg-neutral-800 flex p-1 [&>button]:p-3 gap-1">
				{toolArr.map(({ name, icon }) => (
					<button
						onClick={() => setSelected(name)}
						className={` ${
							selected === name ? "bg-orange-900" : "hover:bg-neutral-700"
						}`}
						key={name}
					>
						{icon}
					</button>
				))}
			</nav>
		</div>
	);
}
