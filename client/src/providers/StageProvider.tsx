import { Group, Layer, Stage } from "react-konva";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { useElements } from "./ElementsProvider";

const context = createContext<{
	getMousePos: (currX: number, currY: number) => { x: number; y: number };
	stageScale: number;
}>({
	getMousePos: () => ({ x: 0, y: 0 }),
	stageScale: 1,
});

export default function StageProvider({ children }: { children: ReactNode }) {
	const { elementsArrRef } = useElements();

	const [dimensions, setDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

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

	useEffect(() => {
		localStorage.setItem("stagePosition", JSON.stringify(position));
	}, [position]);
	useEffect(() => {
		localStorage.setItem("stageScale", scale.toString());
	}, [scale]);

	const updateDimensions = () =>
		setDimensions({ width: window.innerWidth, height: window.innerHeight });

	const handleMouseDown = (
		e: KonvaEventObject<MouseEvent, Node<NodeConfig>>
	) => {
		if (e.evt.button !== 1) return;
		setIsPanning(true);
		setPanStartPos({ x: e.evt.clientX, y: e.evt.clientY });
	};
	const handleMouseUp = (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
		if (e.evt.button === 1) {
			setIsPanning(false);
			console.log("rerendered");
		}
	};
	const handleMouseMove = (
		e: KonvaEventObject<MouseEvent, Node<NodeConfig>>
	) => {
		if (!isPanning) return;
		const dx = e.evt.clientX - panStartPos.x;
		const dy = e.evt.clientY - panStartPos.y;
		setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
		setPanStartPos({ x: e.evt.clientX, y: e.evt.clientY });
	};
	useEffect(() => {
		const handleWheel = (e: WheelEvent) => e.preventDefault();

		window.addEventListener("resize", updateDimensions);
		window.addEventListener("wheel", handleWheel, { passive: false });

		return () => {
			window.removeEventListener("resize", updateDimensions);
			window.removeEventListener("wheel", handleWheel);
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
		<Stage
			width={dimensions.width}
			height={dimensions.height}
			className="bg-neutral-900"
			scaleX={scale}
			scaleY={scale}
			x={position.x}
			y={position.y}
			onWheel={handleOnWheel}
			onMouseMove={handleMouseMove}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
		>
			<Layer>
				<context.Provider
					value={{
						getMousePos,
						stageScale: scale,
					}}
				>
					<Group>{elementsArrRef.current}</Group>
					<Group>{children}</Group>
				</context.Provider>
			</Layer>
		</Stage>
	);
}

export const useStage = () => useContext(context);
