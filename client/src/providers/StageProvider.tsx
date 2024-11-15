import { Layer, Stage } from "react-konva";
import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { useTools } from "./ToolsProvider";
import {
	deserializeKonvaElement,
	serializeKonvaElement,
} from "../utils/konva/convertKonva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import ClearAllHandler from "../handlers/ClearAllHandler";

const context = createContext<{
	elementsArr: JSX.Element[];
	setElementsArr: Dispatch<SetStateAction<JSX.Element[]>>;
	addElementToStage: (element: JSX.Element | null) => void;
	mousePos: { x: number; y: number };
}>({
	elementsArr: [],
	setElementsArr: () => {},
	addElementToStage: () => {},
	mousePos: { x: 0, y: 0 },
});

export default function StageProvider() {
	// elements' section ___
	const [elementsArr, setElementsArr] = useState<JSX.Element[]>([]);
	const addElementToStage = (element: JSX.Element | null) => {
		if (!element) return;
		const newArr = [...elementsArr, element];
		setElementsArr(newArr);

		localStorage.setItem(
			"serializedShapes",
			JSON.stringify(newArr.map((element) => serializeKonvaElement(element)))
		);
	};
	useEffect(() => {
		const serializedShapes = JSON.parse(
			localStorage.getItem("serializedShapes") || "[]"
		) as string[];
		setElementsArr(
			serializedShapes.map((serial) => deserializeKonvaElement(serial))
		);
	}, []);

	// ------------------------------------
	// size, mouse and zoom section ___

	const [dimensions, setDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const { selectedTool } = useTools();

	const [scale, setScale] = useState(() => {
		const storedScale = localStorage.getItem("stageScale");
		return storedScale ? JSON.parse(storedScale) : 1;
	});
	const [position, setPosition] = useState(() => {
		const storedPos = localStorage.getItem("stagePosition");
		console.log({ storedPos });

		return storedPos ? JSON.parse(storedPos) : { x: 0, y: 0 };
	});

	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const updateDimensions = () =>
			setDimensions({ width: window.innerWidth, height: window.innerHeight });
		const handleMouseMove = (e: MouseEvent) => {
			const stage = document.querySelector("canvas")?.getBoundingClientRect();
			const scaleX = scale;
			const scaleY = scale;
			const offsetX = position.x;
			const offsetY = position.y;

			const mouseX = e.clientX - (stage?.left || 0);
			const mouseY = e.clientY - (stage?.top || 0);

			const adjustedX = (mouseX - offsetX) / scaleX;
			const adjustedY = (mouseY - offsetY) / scaleY;

			setMousePos({ x: adjustedX, y: adjustedY });
		};
		window.addEventListener("resize", updateDimensions);
		document.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("resize", updateDimensions);
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, [scale, position]);

	const handleOnWheel = (e: KonvaEventObject<WheelEvent, Node<NodeConfig>>) => {
		const newScale = e.evt.deltaY < 0 ? scale * 1.1 : scale / 1.1;
		if (newScale < 0.2 || newScale > 3) return;

		const stage = e.target.getStage();
		if (!stage) return;

		const scaleFactor = newScale / scale;
		setScale(newScale);
		localStorage.setItem("stageScale", newScale.toString());

		const stagePointerPos = stage.getPointerPosition();
		if (stagePointerPos) {
			const { x, y } = stagePointerPos;
			const newPos = {
				x: x - (x - position.x) * scaleFactor,
				y: y - (y - position.y) * scaleFactor,
			};
			setPosition(newPos);
			localStorage.setItem("stagePosition", JSON.stringify(newPos));
		}
	};

	return (
		<>
			<Stage
				width={dimensions.width}
				height={dimensions.height}
				className="bg-neutral-900 overflow-hidden"
				scaleX={scale}
				scaleY={scale}
				x={position.x}
				y={position.y}
				onWheel={handleOnWheel}
			>
				<Layer>
					{elementsArr}
					<context.Provider
						value={{
							elementsArr,
							setElementsArr,
							addElementToStage,
							mousePos,
						}}
					>
						{selectedTool.handler}
					</context.Provider>
				</Layer>
			</Stage>
			<context.Provider
				value={{
					elementsArr,
					setElementsArr,
					addElementToStage,
					mousePos,
				}}
			>
				<ClearAllHandler />
			</context.Provider>
		</>
	);
}

export const useStage = () => useContext(context);
