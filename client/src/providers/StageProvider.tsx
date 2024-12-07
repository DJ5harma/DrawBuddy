import { Group, Layer, Stage } from "react-konva";
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { IPoint } from "../utils/types";
import { useTools } from "./ToolsProvider";
import StageTeleporter from "../handlers/functional/StageTeleporter";
import StagePositionModRAW from "../handlers/functional/StagePositionModRAW";
import ElementsRenderer from "../handlers/functional/ElementsRenderer";

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

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		window.addEventListener("wheel", handleWheel, { passive: false });
		document.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("wheel", handleWheel);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [stageScale, stagePos, isPanning, panStartPos]);

	const handleWheel = (e: WheelEvent) => e.preventDefault();

	const handleResize = () =>
		setDimensions({ width: window.innerWidth, height: window.innerHeight });

	const handleMouseUp = (e: MouseEvent) => {
		if (e.button === 1 || selectedToolRef.current.name === "Hand")
			setIsPanning(false);
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
				onWheel={(e) => {
					const newScale =
						e.evt.deltaY < 0 ? stageScale * 1.1 : stageScale / 1.1;

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
				}}
				onMouseMove={(e) => {
					if (!isPanning) return;

					const [dx, dy] = [
						e.evt.clientX - panStartPos.x,
						e.evt.clientY - panStartPos.y,
					];

					setStagePos((p) => ({ x: p.x + dx, y: p.y + dy }));

					setPanStartPos({ x: e.evt.clientX, y: e.evt.clientY });
				}}
				onMouseDown={(e) => {
					if (e.evt.button === 1 || selectedToolRef.current.name == "Hand") {
						setIsPanning(true);

						setPanStartPos({ x: e.evt.clientX, y: e.evt.clientY });
					}
				}}
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
				<div
					className="absolute bottom-4 w-full items-center flex flex-col gap-4 select-none"
					onMouseDown={(e) => e.stopPropagation()}
				>
					<StageTeleporter />
					<StagePositionModRAW />
				</div>
			</context.Provider>
		</>
	);
}

export const useStage = () => useContext(context);
