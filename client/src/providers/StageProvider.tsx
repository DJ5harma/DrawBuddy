import { Group, Layer, Stage } from "react-konva";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { useTools } from "./ToolsProvider";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { useElements } from "./ElementsProvider";
import MyNewElementProvider from "./MyNewElementProvider";

const context = createContext<{
	getMousePos: (currX: number, currY: number) => { x: number; y: number };
	stageScale: number;
	stagePosition: { x: number; y: number };
	stageDimensions: { width: number; height: number };
}>({
	getMousePos: () => ({ x: 0, y: 0 }),
	stageScale: 1,
	stagePosition: { x: 0, y: 0 },
	stageDimensions: {
		width: window.innerWidth,
		height: window.innerHeight,
	},
});

export default function StageProvider({ children }: { children: ReactNode }) {
	const { elementsArrRef } = useElements();

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

	const [isPanning, setIsPanning] = useState(false);
	const [panStartPos, setPanStartPos] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	const getMousePos = (currX: number, currY: number) => {
		const stage = document.querySelector("canvas")?.getBoundingClientRect();

		const [mouseX, mouseY] = [
			currX - (stage?.left || 0),
			currY - (stage?.top || 0),
		];

		const [adjustedX, adjustedY] = [
			(mouseX - position.x) / scale,
			(mouseY - position.y) / scale,
		];

		return { x: adjustedX, y: adjustedY };
	};
	// const revertMousePos = (adjustedX: number, adjustedY: number) => {
	// 	const stage = document.querySelector("canvas")?.getBoundingClientRect();

	// 	const [mouseX, mouseY] = [
	// 		adjustedX * scale + position.x,
	// 		adjustedY * scale + position.y,
	// 	];
	// 	const [currX, currY] = [
	// 		mouseX + (stage?.left || 0),
	// 		mouseY + (stage?.top || 0),
	// 	];

	// 	return { x: currX, y: currY };
	// };

	useEffect(() => {
		localStorage.setItem("stagePosition", JSON.stringify(position));
	}, [position]);
	useEffect(() => {
		localStorage.setItem("stageScale", scale.toString());
	}, [scale]);

	useEffect(() => {
		const updateDimensions = () =>
			setDimensions({ width: window.innerWidth, height: window.innerHeight });

		const handleMouseDown = (e: MouseEvent) => {
			if (e.button !== 1) return;
			setIsPanning(true);
			setPanStartPos({ x: e.clientX, y: e.clientY });
		};
		const handleMouseUp = (e: MouseEvent) => {
			if (e.button === 1) setIsPanning(false);
		};
		const handleMouseMove = (e: MouseEvent) => {
			if (!isPanning) return;
			const dx = e.clientX - panStartPos.x;
			const dy = e.clientY - panStartPos.y;
			setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
			setPanStartPos({ x: e.clientX, y: e.clientY });
		};
		const handleWheel = (e: WheelEvent) => e.preventDefault();

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
		setScale(newScale);

		const stage = e.target.getStage();
		if (!stage) return;

		const scaleFactor = newScale / scale;

		const stagePointerPos = stage.getPointerPosition();
		if (!stagePointerPos) return;

		const { x, y } = stagePointerPos;

		setPosition({
			x: x - (x - position.x) * scaleFactor,
			y: y - (y - position.y) * scaleFactor,
		});
	};

	return (
		<>
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
					<context.Provider
						value={{
							getMousePos,
							stageScale: scale,
							stagePosition: position,
							stageDimensions: dimensions,
						}}
					>
						<Group>{elementsArrRef.current}</Group>
						<Group>
							<MyNewElementProvider>
								{!isPanning && selectedTool && selectedTool.handler}
								{children}
							</MyNewElementProvider>
						</Group>
					</context.Provider>
				</Layer>
			</Stage>
		</>
	);
}

export const useStage = () => useContext(context);
