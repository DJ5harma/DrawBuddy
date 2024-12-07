import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { useElements } from "./ElementsProvider";
import ManageStagePosition from "../handlers/functional/ManageStagePosition";
import { IPoint } from "../utils/types";
import { useTools } from "./ToolsProvider";

const context = createContext<{
	getMousePos: (currX: number, currY: number) => IPoint;
	stageScale: number;
	setStageScale: Dispatch<SetStateAction<number>>;
	stagePos: IPoint;
	setStagePos: Dispatch<SetStateAction<IPoint>>;
}>({
	getMousePos: () => ({ x: 0, y: 0 }),
	stageScale: 1,
	setStageScale: () => {},
	stagePos: { x: 0, y: 0 },
	setStagePos: () => {},
});

export default function StageProvider({ children }: { children: ReactNode }) {
	const { selectedToolRef } = useTools();

	const { elementsRef, removeElementFromStage } = useElements();

	const [dimensions, setDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const [stageScale, setStageScale] = useState(() => {
		const storedScale = localStorage.getItem("stageScale");
		return (storedScale ? JSON.parse(storedScale) : 1) as number;
	});

	const [stagePos, setStagePos] = useState<IPoint>(() => {
		const storedPos = localStorage.getItem("stagePos");
		return storedPos ? JSON.parse(storedPos) : { x: 0, y: 0 };
	});

	const [isPanning, setIsPanning] = useState(false);

	const [panStartPos, setPanStartPos] = useState<IPoint>({
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
			(mouseX - stagePos.x) / stageScale,
			(mouseY - stagePos.y) / stageScale,
		];

		return { x: adjustedX, y: adjustedY };
	};

	useEffect(() => {
		localStorage.setItem("stagePos", JSON.stringify(stagePos));
	}, [stagePos]);

	useEffect(() => {
		localStorage.setItem("stageScale", stageScale.toString());
	}, [stageScale]);

	const updateDimensions = () =>
		setDimensions({ width: window.innerWidth, height: window.innerHeight });

	const handleMouseDown = (
		e: KonvaEventObject<MouseEvent, Node<NodeConfig>>
	) => {
		if (e.evt.button === 1 || selectedToolRef.current.name == "Hand") {
			setIsPanning(true);
			setPanStartPos({ x: e.evt.clientX, y: e.evt.clientY });
		}
	};

	const handleMouseUp = (e: MouseEvent) => {
		if (e.button === 1 || selectedToolRef.current.name === "Hand")
			setIsPanning(false);
	};

	const handleMouseMove = (
		e: KonvaEventObject<MouseEvent, Node<NodeConfig>>
	) => {
		if (!isPanning) return;
		const dx = e.evt.clientX - panStartPos.x;
		const dy = e.evt.clientY - panStartPos.y;
		setStagePos((p) => ({ x: p.x + dx, y: p.y + dy }));
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
	}, [stageScale, stagePos, isPanning, panStartPos]);

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

		setStagePos({
			x: x - (x - stagePos.x) * scaleFactor,
			y: y - (y - stagePos.y) * scaleFactor,
		});
	};

	const ElementsRenderer = () => {
		const dragRef = useRef({
			isDragging: false,
			startPos: stagePos,
			endPos: stagePos,
		});

		return [...elementsRef.current.values()].map(({ shape }) => {
			if (!shape || !shape.key) return null;
			const { key } = shape;

			const { type, props } = shape;

			const draggable = selectedToolRef.current.name === "Pointer";

			const handleDragStart = (
				e: KonvaEventObject<DragEvent, Node<NodeConfig>>
			) => {
				dragRef.current.isDragging = true;
				dragRef.current.startPos = { x: e.evt.clientX, y: e.evt.clientY };
				console.log(dragRef.current);
			};
			const handleDragEnd = (
				e: KonvaEventObject<DragEvent, Node<NodeConfig>>
			) => {
				dragRef.current.isDragging = false;
				dragRef.current.endPos = { x: e.evt.clientX, y: e.evt.clientY };
				console.log(dragRef.current);

				const posDiff = {
					x: dragRef.current.endPos.x - dragRef.current.startPos.x,
					y: dragRef.current.endPos.y - dragRef.current.startPos.y,
				};

				console.log(posDiff);
			};
			switch (type) {
				case "Rect":
					return (
						<Rect
							key={key}
							{...props}
							onClick={() => removeElementFromStage(key)}
							draggable={draggable}
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
						/>
					);
				case "Circle":
					return (
						<Circle
							key={key}
							{...props}
							onClick={() => removeElementFromStage(key)}
							draggable={draggable}
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
						/>
					);
				case "Line":
					return (
						<Line
							key={key}
							{...props}
							onClick={() => removeElementFromStage(key)}
							draggable={draggable}
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
						/>
					);
				case "Text":
					return (
						<Text
							key={key}
							{...props}
							onClick={() => removeElementFromStage(key)}
							draggable={draggable}
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
						/>
					);
				default:
					return null;
			}
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
				x={stagePos.x}
				y={stagePos.y}
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
							stagePos,
							setStagePos,
							setStageScale,
						}}
					>
						<Group>
							<ElementsRenderer />
						</Group>
						<Group>{children}</Group>
					</context.Provider>
				</Layer>
			</Stage>

			<context.Provider
				value={{
					getMousePos,
					stageScale,
					stagePos,
					setStagePos,
					setStageScale,
				}}
			>
				<ManageStagePosition />
			</context.Provider>
		</>
	);
}

export const useStage = () => useContext(context);
