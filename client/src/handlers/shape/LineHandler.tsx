import { useEffect, useState } from "react";
import { Line } from "react-konva";
import { useStage } from "../../providers/StageProvider";
import { useElements } from "../../providers/ElementsProvider";
import { useToolSettings } from "../../providers/ToolSettingsProvider";
import { useMyNewElement } from "../../providers/MyNewElementProvider";

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

	const { getMousePos } = useStage();
	const { elementsArrRef, addElementToStage } = useElements();

	const { myNewElement, setMyNewElement } = useMyNewElement();

	const { strokeColor, strokeWidth, opacity, dashGap } = useToolSettings();

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (e.button !== 0) return;
			const { x, y } = getMousePos(e.clientX, e.clientY);
			if (multipleLines.exist)
				return setMultipleLines((p) => ({
					...p,
					pointsArr: [...p.pointsArr, x, y],
				}));

			setDrawing(true);
			setStartingPosition({ x, y });
		};
		const handleMouseMove = (e: MouseEvent) => {
			if (!drawing) return;

			const { x, y } = getMousePos(e.clientX, e.clientY);
			setMyNewElement(
				<Line
					key={"Line" + elementsArrRef.current.length}
					points={
						multipleLines.exist
							? [...multipleLines.pointsArr, x, y]
							: [startingPosition.x, startingPosition.y, x, y]
					}
					strokeEnabled
					strokeWidth={strokeWidth}
					stroke={strokeColor}
					opacity={opacity}
					dashEnabled={dashGap > 0}
					dash={[dashGap]}
				/>
			);
		};
		const handleMouseUp = (e: MouseEvent) => {
			const { x, y } = getMousePos(e.clientX, e.clientY);
			if (multipleLines.exist) return;
			if (x === startingPosition.x && y === startingPosition.y) {
				setMultipleLines({ pointsArr: [x, y], exist: true });
				return;
			}
			addElementToStage(myNewElement);
			setDrawing(false);
			setMyNewElement(null);
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			if (multipleLines.exist && e.key === "Escape") {
				setMultipleLines({ exist: false, pointsArr: [] });
				addElementToStage(myNewElement);
				setDrawing(false);
				setMyNewElement(null);
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
	}, [drawing, startingPosition, myNewElement, multipleLines]);
	return null;
}
