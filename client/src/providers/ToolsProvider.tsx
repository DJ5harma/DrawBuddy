import { createContext, ReactNode, useContext, useState } from "react";
import { BiPencil } from "react-icons/bi";
import { FaMousePointer } from "react-icons/fa";
import { FaArrowRightLong, FaHand } from "react-icons/fa6";
import { FiCircle } from "react-icons/fi";
import { ImTextColor } from "react-icons/im";
import { LuDiamond, LuEraser, LuRectangleHorizontal } from "react-icons/lu";
import { MdOutlineDelete, MdOutlineHorizontalRule } from "react-icons/md";
import { RiGalleryLine } from "react-icons/ri";
import RectangleHandler from "../handlers/shape/RectangleHandler";
import CircleHandler from "../handlers/shape/CircleHandler";
import LineHandler from "../handlers/shape/LineHandler";
import ClearAllHandler from "../handlers/functional/ClearAllHandler";
import PencilHandler from "../handlers/shape/PencilHandler";
import { ITool } from "../utils/types";

export const toolArr: ITool[] = [
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
		handler: <PencilHandler />,
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
	{
		name: "ClearAll",
		handler: <ClearAllHandler />,
		icon: <MdOutlineDelete />,
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
								localStorage.setItem("selectedToolIndex", i.toString());
								setSelectedTool(tool);
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

const context = createContext<{ selectedTool: ITool }>({
	selectedTool: toolArr[2],
});

export const useTools = () => useContext(context);
