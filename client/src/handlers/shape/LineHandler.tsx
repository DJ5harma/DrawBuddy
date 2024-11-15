import { useEffect, useState } from "react";
import { Line } from "react-konva";
import { useStage } from "../../providers/StageProvider";
import { useElements } from "../../providers/ElementsProvider";

export default function LineHandler() {
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
	const { elementsArr, addElementToStage, myNewElement, setMyNewElement } =
		useElements();

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (e.button !== 0) return;
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
			setMyNewElement(
				<Line
					key={"Line" + elementsArr.length}
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
			addElementToStage();
			setDrawing(false);
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			if (multipleLines.exist && e.key === "Escape") {
				setMultipleLines({ exist: false, pointsArr: [] });
				addElementToStage();
				setDrawing(false);
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
	}, [drawing, startingPosition, myNewElement, multipleLines, mousePos]);
	return null;
}
