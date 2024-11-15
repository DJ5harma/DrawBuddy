import { useEffect, useState } from "react";
import { Line } from "react-konva";
import { useStage } from "../../providers/StageProvider";
import { useElements } from "../../providers/ElementsProvider";

export default function LineHandler() {
	const [NewLine, setNewLine] = useState<JSX.Element | null>(null);
	const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });
	const [drawing, setDrawing] = useState(false);

	const [multipleLines, setMultipleLines] = useState<{
		exist: boolean;
		pointsArr: number[];
	}>({
		exist: false,
		pointsArr: [],
	});

	const { mousePos } = useStage();
	const { addElementToStage } = useElements();

	useEffect(() => {
		const handleMouseDown = () => {
			const { x, y } = mousePos;
			if (multipleLines.exist)
				return setMultipleLines((p) => ({
					...p,
					pointsArr: [...p.pointsArr, x, y],
				}));

			setDrawing(true);
			setStartingPosition({ x, y });
		};
		const handleMouseMove = () => {
			if (!drawing) return;

			const { x, y } = mousePos;
			setNewLine(
				<Line
					key={Math.random()}
					points={
						multipleLines.exist
							? [...multipleLines.pointsArr, x, y]
							: [startingPosition.x, startingPosition.y, x, y]
					}
					strokeEnabled
					strokeWidth={4}
					stroke={"red"}
				/>
			);
		};
		const handleMouseUp = () => {
			const { x, y } = mousePos;
			if (multipleLines.exist) return;
			if (x === startingPosition.x && y === startingPosition.y) {
				setMultipleLines({ pointsArr: [x, y], exist: true });
				return;
			}

			addElementToStage(NewLine);
			setNewLine(null);
			setDrawing(false);
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			if (multipleLines.exist && e.key === "Escape") {
				setDrawing(false);
				setNewLine(null);
				const pointsArr = multipleLines.pointsArr;
				setMultipleLines({ exist: false, pointsArr: [] });
				addElementToStage(
					<Line
						key={Math.random()}
						points={pointsArr}
						strokeEnabled
						strokeWidth={4}
						stroke={"red"}
					/>
				);
				return;
			}
		};
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("keyup", handleKeyUp);
		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, [drawing, startingPosition, NewLine, multipleLines, mousePos]);

	return NewLine;
}
