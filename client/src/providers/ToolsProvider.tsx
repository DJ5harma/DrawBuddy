import {
	createContext,
	MutableRefObject,
	ReactNode,
	useContext,
	useRef,
	useState,
} from "react";
import { BiPencil } from "react-icons/bi";
import { FaMousePointer } from "react-icons/fa";
import { FaArrowRightLong, FaHand } from "react-icons/fa6";
import { FiCircle } from "react-icons/fi";
import { ImTextColor } from "react-icons/im";
import { LuDiamond, LuEraser, LuRectangleHorizontal } from "react-icons/lu";
import { MdOutlineHorizontalRule } from "react-icons/md";
import { RiGalleryLine } from "react-icons/ri";
import RectangleHandler from "../handlers/shape/RectangleHandler";
import CircleHandler from "../handlers/shape/CircleHandler";
import LineHandler from "../handlers/shape/LineHandler";
import PencilHandler from "../handlers/shape/PencilHandler";
import { ITool } from "../utils/types";
import TextHandler from "../handlers/shape/TextHandler";

const toolArr: ITool[] = [
	{
		name: "Hand",
		icon: <FaHand />,
		handler: <></>, // implemented without any special handler
		cursor: "grab",
	},
	{
		name: "Pointer",
		icon: <FaMousePointer />,
		handler: <></>,
		cursor: "default",
	},
	{
		name: "Rectangle",
		icon: <LuRectangleHorizontal />,
		handler: <RectangleHandler />,
		cursor: "crosshair",
	},
	{
		name: "Diamond",
		icon: <LuDiamond />,
		handler: <></>,
		cursor: "crosshair",
	},
	{
		name: "Circle",
		icon: <FiCircle />,
		handler: <CircleHandler />,
		cursor: "crosshair",
	},
	{
		name: "Arrow",
		icon: <FaArrowRightLong />,
		handler: <></>,
		cursor: "crosshair",
	},
	{
		name: "Line",
		icon: <MdOutlineHorizontalRule />,
		handler: <LineHandler />,
		cursor: "crosshair",
	},
	{
		name: "Pencil",
		icon: <BiPencil />,
		handler: <PencilHandler />,
		cursor: "crosshair",
	},
	{
		name: "Text",
		icon: <ImTextColor />,
		handler: <TextHandler />,
		cursor: "text",
	},
	{
		name: "Gallery",
		icon: <RiGalleryLine />,
		handler: <></>,
		cursor: "default",
	},
	{
		name: "Eraser",
		icon: <LuEraser />,
		handler: <></>, // implemented without any special handler
		cursor: "default",
	},
];

export default function ToolsProvider({ children }: { children: ReactNode }) {
	const selectedToolRef = useRef<ITool>(
		toolArr[
			parseInt(localStorage.getItem("selectedToolIndex") || "2") %
				toolArr.length
		]
	);

	const [flickerForToolChange, setFlickerForToolChange] = useState(false);
	return (
		<>
			<div
				className="w-screen absolute top-4 left-0 flex justify-center items-center z-50 flex-col gap-2"
				style={{
					transform: "scale(1)",
				}}
			>
				<nav
					className="top-2 bg-neutral-800 flex p-1 [&>button]:p-3 gap-1"
					onMouseDown={(e) => e.stopPropagation()}
				>
					{toolArr.map((tool, i) => (
						<button
							onClick={() => {
								selectedToolRef.current = tool;
								setFlickerForToolChange(!flickerForToolChange);
								localStorage.setItem("selectedToolIndex", i.toString());
							}}
							className={
								selectedToolRef.current.name === tool.name
									? "bg-orange-900"
									: "hover:bg-neutral-700"
							}
							key={tool.name + "tool"}
						>
							{tool.icon}
						</button>
					))}
				</nav>
				{selectedToolRef.current.name === "Eraser" && (
					<p className="text-xl bg-black p-2 rounded-xl">
						Click inside an element to erase
					</p>
				)}
			</div>
			<context.Provider value={{ selectedToolRef }}>
				<div className={`cursor-${selectedToolRef.current.cursor}`}>
					{children}
				</div>
			</context.Provider>
		</>
	);
}

const context = createContext<{ selectedToolRef: MutableRefObject<ITool> }>({
	selectedToolRef: { current: toolArr[4] },
});

export const useTools = () => useContext(context);
