import { Layer, Stage } from "react-konva";
import { createContext, useContext, useEffect, useState } from "react";
import { useTools } from "./ToolsProvider";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { useElements } from "./ElementsProvider";

const context = createContext<{
	mousePos: { x: number; y: number };
}>({
	mousePos: { x: 0, y: 0 },
});

export default function StageProvider() {
	const { elementsArr, myNewElement } = useElements();

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
		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
		};
		window.addEventListener("resize", updateDimensions);
		window.addEventListener("wheel", handleWheel, { passive: false });
		document.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("resize", updateDimensions);
			window.removeEventListener("wheel", handleWheel);
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
