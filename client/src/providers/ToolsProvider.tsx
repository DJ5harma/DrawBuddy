import {
	createContext,
	MutableRefObject,
	ReactNode,
	useContext,
	useEffect,
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
		description: "Drag your canvas",
	},
	{
		name: "Pointer",
		icon: <FaMousePointer />,
		handler: <></>, // implemented without any special handler
		cursor: "default",
		description: "Drag elements",
	},
	{
		name: "Rectangle",
		icon: <LuRectangleHorizontal />,
		handler: <RectangleHandler />,
		cursor: "crosshair",
		description: "Rectangle",
	},
	{
		name: "Diamond",
		icon: <LuDiamond />,
		handler: <></>, // not implemented yet
		cursor: "crosshair",
		description: "Not implemented yet, please choose another",
	},
	{
		name: "Circle",
		icon: <FiCircle />,
		handler: <CircleHandler />,
		cursor: "crosshair",
		description: "Circle",
	},
	// {
	// 	name: "Arrow",
	// 	icon: <FaArrowRightLong />,
	// 	handler: <></>,
	// 	cursor: "crosshair",
	// },
	{
		name: "Line",
		icon: <MdOutlineHorizontalRule />,
		handler: <LineHandler />,
		cursor: "crosshair",
		description: "Line",
	},
	{
		name: "Pencil",
		icon: <BiPencil />,
		handler: <PencilHandler />,
		cursor: "crosshair",
		description: "Pencil",
	},
	{
		name: "Text",
		icon: <ImTextColor />,
		handler: <TextHandler />,
		cursor: "text",
		description: "Click anywhere to change text position or ESC to finalize",
	},
	{
		name: "Gallery",
		icon: <RiGalleryLine />,
		handler: <></>,
		cursor: "default",
		description: "Not implemented yet, please choose another",
	},
	{
		name: "Eraser",
		icon: <LuEraser />,
		handler: <></>, // implemented without any special handler
		cursor: "default",
		description: "Click inside elements to erase",
	},
];

const context = createContext<{ selectedToolRef: MutableRefObject<ITool> }>({
	selectedToolRef: { current: toolArr[4] },
});

export default function ToolsProvider({ children }: { children: ReactNode }) {
	const selectedToolRef = useRef<ITool>(
		toolArr[
			parseInt(localStorage.getItem("selectedToolIndex") || "2") %
				toolArr.length
		]
	);

	const [flickerForToolChange, setFlickerForToolChange] = useState(false);

	const updateTool = (i: number) => {
		if (selectedToolRef.current.name === toolArr[i].name) return;
		selectedToolRef.current = toolArr[i];
		setFlickerForToolChange(!flickerForToolChange);
		localStorage.setItem("selectedToolIndex", i.toString());
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeydown);
		return () => {
			window.removeEventListener("keydown", handleKeydown);
		};
	}, [selectedToolRef.current.name]);

	const handleKeydown = (e: KeyboardEvent) => {
		// if (!e.altKey) return;

		const i = e.key.charCodeAt(0) - "0".charCodeAt(0);
		let easyIndex = (i - 1) % toolArr.length;
		if (easyIndex === -1) easyIndex = toolArr.length - 1;

		if (i >= 0 && i <= 9) updateTool(easyIndex);
	};

	return (
		<>
			<div
				className="w-screen absolute top-4 left-0 flex justify-center items-center z-50 flex-col gap-2"
				style={{
					transform: "scale(1)",
				}}
			>
				<nav
					className="top-2 bg-neutral-800 flex px-1 [&>button]:p-3 [&>button]:pb-2  gap-1"
					onMouseDown={(e) => e.stopPropagation()}
				>
					{toolArr.map((tool, i) => {
						const easyIndex = (i + 1) % toolArr.length;
						return (
							<button
								onClick={() => updateTool(i)}
								className={
									"flex flex-col justify-between items-center gap-0.5 " +
									(selectedToolRef.current.name === tool.name
										? "bg-orange-900"
										: "hover:bg-neutral-700")
								}
								key={tool.name + "tool"}
							>
								<div>{tool.icon}</div>
								<p className="" style={{ fontSize: 10 }}>
									{easyIndex}
								</p>
							</button>
						);
					})}
				</nav>
				{selectedToolRef.current.description && (
					<p className="bg-black py-2 px-4 rounded-xl">
						{selectedToolRef.current.description}
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

export const useTools = () => useContext(context);
