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
import ManageStagePosition from "../handlers/functional/ManageStagePosition";

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

	const [stageScale, setStageScale] = useState(() => {
		const storedScale = localStorage.getItem("stageScale");
		return (storedScale ? JSON.parse(storedScale) : 1) as number;
	});
	const [stagePosition, setStagePosition] = useState<{ x: number; y: number }>(
		() => {
			const storedPos = localStorage.getItem("stagePosition");
			return storedPos ? JSON.parse(storedPos) : { x: 0, y: 0 };
		}
	);

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
			(mouseX - stagePosition.x) / stageScale,
			(mouseY - stagePosition.y) / stageScale,
		];

		return { x: adjustedX, y: adjustedY };
	};

	useEffect(() => {
		localStorage.setItem("stagePosition", JSON.stringify(stagePosition));
	}, [stagePosition]);
	useEffect(() => {
		localStorage.setItem("stageScale", stageScale.toString());
	}, [stageScale]);

	const updateDimensions = () =>
		setDimensions({ width: window.innerWidth, height: window.innerHeight });

	const handleMouseDown = (
		e: KonvaEventObject<MouseEvent, Node<NodeConfig>>
	) => {
		if (e.evt.button !== 1) return;
		setIsPanning(true);
		setPanStartPos({ x: e.evt.clientX, y: e.evt.clientY });
	};
	const handleMouseUp = (e: MouseEvent) => {
		if (e.button === 1) {
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
		setStagePosition((p) => ({ x: p.x + dx, y: p.y + dy }));
		setPanStartPos({ x: e.evt.clientX, y: e.evt.clientY });
	};
	useEffect(() => {
		const handleWheel = (e: WheelEvent) => e.preventDefault();

		window.addEventListener("resize", updateDimensions);
		window.addEventListener("wheel", handleWheel, { passive: false });
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("resize", updateDimensions);
			window.removeEventListener("wheel", handleWheel);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [stageScale, stagePosition, isPanning, panStartPos]);

	const handleOnWheel = (e: KonvaEventObject<WheelEvent, Node<NodeConfig>>) => {
		const newScale = e.evt.deltaY < 0 ? stageScale * 1.1 : stageScale / 1.1;
		if (newScale < 0.05 || newScale > 20) return;
		setStageScale(newScale);

		const stage = e.target.getStage();
		if (!stage) return;

		const scaleFactor = newScale / stageScale;

		const stagePointerPos = stage.getPointerPosition();
		if (!stagePointerPos) return;

		const { x, y } = stagePointerPos;

		setStagePosition({
			x: x - (x - stagePosition.x) * scaleFactor,
			y: y - (y - stagePosition.y) * scaleFactor,
		});
	};

	return (
		<>
			<Stage
				width={dimensions.width}
				height={dimensions.height}
				className="bg-neutral-900"
				scaleX={stageScale}
				scaleY={stageScale}
				x={stagePosition.x}
				y={stagePosition.y}
				onWheel={handleOnWheel}
				onMouseMove={handleMouseMove}
				onMouseDown={handleMouseDown}
				onMouseEnter={() => setIsPanning(false)}
			>
				<Layer>
					<context.Provider
						value={{
							getMousePos,
							stageScale,
						}}
					>
						<Group>{elementsArrRef.current}</Group>
						<Group>{children}</Group>
					</context.Provider>
				</Layer>
			</Stage>
			<ManageStagePosition
				stagePosition={stagePosition}
				setStagePosition={setStagePosition}
			/>
		</>
	);
}

export const useStage = () => useContext(context);
