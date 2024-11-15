import { useEffect, useState } from "react";
import { Line } from "react-konva";
import { useStage } from "../providers/StageProvider";

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

	const { addElementToStage } = useStage();

	const handleMouseDown = (e: MouseEvent) => {
		const { clientX: x, clientY: y } = e;
		if (multipleLines.exist) {
			setMultipleLines((p) => ({ ...p, pointsArr: [...p.pointsArr, x, y] }));
			return;
		}
		setDrawing(true);
		setStartingPosition({ x, y });
	};
	const handleMouseMove = (e: MouseEvent) => {
		if (!drawing) return;

		const { clientX: x, clientY: y } = e;
		if (multipleLines.exist) {
			setNewLine(
				<Line
					key={Math.random()}
					points={[...multipleLines.pointsArr, x, y]}
					strokeEnabled
					strokeWidth={4}
					stroke={"red"}
				/>
			);
			return;
		}
		setNewLine(
			<Line
				key={Math.random()}
				points={[startingPosition.x, startingPosition.y, x, y]}
				strokeEnabled
				strokeWidth={4}
				stroke={"red"}
			/>
		);
	};
	const handleMouseUp = (e: MouseEvent) => {
		const { clientX: x, clientY: y } = e;
		if (multipleLines.exist) return;
		if (x === startingPosition.x && y === startingPosition.y) {
			setMultipleLines({ pointsArr: [x, y], exist: true });
			return;
		}

		const newElem = NewLine;
		setNewLine(null);
		addElementToStage(newElem);
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

	useEffect(() => {
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
	}, [drawing, startingPosition, NewLine, multipleLines]);

	return NewLine;
}
