import { Layer, Stage } from "react-konva";
import { createContext, useContext, useEffect, useState } from "react";
import { useTools } from "./ToolsProvider";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { useElements } from "./ElementsProvider";
import { deserializeKonvaElement } from "../utils/konva/convertKonva";

const context = createContext<{
	mousePos: { x: number; y: number };
}>({
	mousePos: { x: 0, y: 0 },
});

export default function StageProvider() {
	const { elementsArr, myNewElement, peerElementsArr } = useElements();

	const [dimensions, setDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const { selectedTool } = useTools();

	const [scale, setScale] = useState(() => {
		const storedScale = localStorage.getItem("stageScale");
		return (storedScale ? JSON.parse(storedScale) : 1) as number;
	});
	const [position, setPosition] = useState<{ x: number; y: number }>(() => {
		const storedPos = localStorage.getItem("stagePosition");
		return storedPos ? JSON.parse(storedPos) : { x: 0, y: 0 };
	});

	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const [isPanning, setIsPanning] = useState(false);
	const [panStartPos, setPanStartPos] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	useEffect(() => {
		localStorage.setItem("stagePosition", JSON.stringify(position));
	}, [position]);
	useEffect(() => {
		localStorage.setItem("stageScale", scale.toString());
	}, [scale]);

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

			if (isPanning) {
				const dx = e.clientX - panStartPos.x;
				const dy = e.clientY - panStartPos.y;
				setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
				setPanStartPos({ x: e.clientX, y: e.clientY });
			}
		};
		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
		};
		const handleMouseDown = (e: MouseEvent) => {
			if (e.button === 1) {
				setIsPanning(true);
				setPanStartPos({ x: e.clientX, y: e.clientY });
			}
		};
		const handleMouseUp = (e: MouseEvent) => {
			if (e.button === 1) setIsPanning(false);
		};

		window.addEventListener("resize", updateDimensions);
		window.addEventListener("wheel", handleWheel, { passive: false });
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("resize", updateDimensions);
			window.removeEventListener("wheel", handleWheel);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [scale, position, isPanning, panStartPos]);

	const handleOnWheel = (e: KonvaEventObject<WheelEvent, Node<NodeConfig>>) => {
		const newScale = e.evt.deltaY < 0 ? scale * 1.1 : scale / 1.1;
		if (newScale < 0.05 || newScale > 20) return;

		const stage = e.target.getStage();
		if (!stage) return;

		const scaleFactor = newScale / scale;
		setScale(newScale);

		const stagePointerPos = stage.getPointerPosition();
		if (stagePointerPos) {
			const { x, y } = stagePointerPos;
			const newPos = {
				x: x - (x - position.x) * scaleFactor,
				y: y - (y - position.y) * scaleFactor,
			};
			setPosition(newPos);
		}
	};

	return (
		<Stage
			width={dimensions.width}
			height={dimensions.height}
			className="bg-neutral-900"
			scaleX={scale}
			scaleY={scale}
			x={position.x}
			y={position.y}
			onWheel={handleOnWheel}
		>
			<Layer>
				{elementsArr.map((elem) => deserializeKonvaElement(elem))}
				{peerElementsArr.map((elem) => deserializeKonvaElement(elem))}
				{myNewElement && myNewElement}
				<context.Provider
					value={{
						mousePos,
					}}
				>
					{selectedTool && selectedTool.handler}
				</context.Provider>
			</Layer>
		</Stage>
	);
}

export const useStage = () => useContext(context);
