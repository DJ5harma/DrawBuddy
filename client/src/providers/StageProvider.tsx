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
	// mouse and zoom section ___

	const [dimensions, setDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const updateDimensions = () =>
		setDimensions({ width: window.innerWidth, height: window.innerHeight });

	const { selectedTool } = useTools();

	const [scale, setScale] = useState(1);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
	useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("resize", updateDimensions);
		return () => {
			window.removeEventListener("resize", updateDimensions);
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, [scale, position]);

	return (
		<Stage
			width={dimensions.width}
			height={dimensions.height}
			className="bg-neutral-900 overflow-hidden"
			scaleX={scale}
			scaleY={scale}
			x={position.x}
			y={position.y}
			onWheel={(e) => {
				const newScale = e.evt.deltaY < 0 ? scale * 1.1 : scale / 1.1;
				if (newScale < 0.2 || newScale > 3) return;

				const stage = e.target.getStage();
				if (!stage) return;

				const scaleFactor = newScale / scale;
				setScale(newScale);

				const mousePos = stage.getPointerPosition();
				if (mousePos) {
					const mouseX = mousePos.x;
					const mouseY = mousePos.y;
					const newX = mouseX - (mouseX - position.x) * scaleFactor;
					const newY = mouseY - (mouseY - position.y) * scaleFactor;
					setPosition({ x: newX, y: newY });
				}
			}}
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
	);
}

export const useStage = () => useContext(context);
