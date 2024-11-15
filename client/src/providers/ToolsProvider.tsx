import { createContext, ReactNode, useContext, useState } from "react";
import { BiPencil } from "react-icons/bi";
import { FaMousePointer } from "react-icons/fa";
import { FaArrowRightLong, FaHand } from "react-icons/fa6";
import { FiCircle } from "react-icons/fi";
import { ImTextColor } from "react-icons/im";
import { LuDiamond, LuEraser, LuRectangleHorizontal } from "react-icons/lu";
import { MdOutlineHorizontalRule } from "react-icons/md";
import { RiGalleryLine } from "react-icons/ri";
import RectangleHandler from "../handlers/RectangleHandler";
import CircleHandler from "../handlers/CircleHandler";
import LineHandler from "../handlers/LineHandler";

type ITool = {
	name:
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
	icon: ReactNode;
	handler: ReactNode;
};

const toolArr: ITool[] = [
	{
		name: "Hand",
		icon: <FaHand />,
		handler: <></>,
	},
	{
		name: "Pointer",
		icon: <FaMousePointer />,
		handler: <></>,
	},
	{
		name: "Rectangle",
		icon: <LuRectangleHorizontal />,
		handler: <RectangleHandler />,
	},
	{
		name: "Diamond",
		icon: <LuDiamond />,
		handler: <></>,
	},
	{
		name: "Circle",
		icon: <FiCircle />,
		handler: <CircleHandler />,
	},
	{
		name: "Arrow",
		icon: <FaArrowRightLong />,
		handler: <></>,
	},
	{
		name: "Line",
		icon: <MdOutlineHorizontalRule />,
		handler: <LineHandler />,
	},
	{
		name: "Pencil",
		icon: <BiPencil />,
		handler: <></>,
	},
	{
		name: "Text",
		icon: <ImTextColor />,
		handler: <></>,
	},
	{
		name: "Gallery",
		icon: <RiGalleryLine />,
		handler: <></>,
	},
	{
		name: "Eraser",
		icon: <LuEraser />,
		handler: <></>,
	},
];
export default function ToolsProvider({ children }: { children: ReactNode }) {
	const [selectedTool, setSelectedTool] = useState<ITool>(
		toolArr[parseInt(localStorage.getItem("selectedToolIndex") || "2")]
	);

	return (
		<context.Provider value={{ selectedTool }}>
			<div
				className="w-screen absolute top-4 left-0 flex justify-center items-center z-10"
				style={{
					transform: "scale(1)",
				}}
			>
				<nav className="top-2 bg-neutral-800 flex p-1 [&>button]:p-3 gap-1">
					{toolArr.map((tool, i) => (
						<button
							onClick={() => {
								setSelectedTool(tool);
								localStorage.setItem("selectedToolIndex", i.toString());
							}}
							className={
								selectedTool.name === tool.name
									? "bg-orange-900"
									: "hover:bg-neutral-700"
							}
							key={tool.name}
						>
							{tool.icon}
						</button>
					))}
				</nav>
			</div>
			{children}
		</context.Provider>
	);
}

const context = createContext({ selectedTool: toolArr[2] });

export const useTools = () => useContext(context);
