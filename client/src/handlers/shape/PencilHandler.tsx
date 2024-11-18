import { useEffect, useState } from "react";
import { Line } from "react-konva";
import { useStage } from "../../providers/StageProvider";
import { useElements } from "../../providers/ElementsProvider";
import { useToolSettings } from "../../providers/ToolSettingsProvider";

export default function PencilHandler() {
	const [pointsArr, setPointsArr] = useState<number[]>([]);
	const [drawing, setDrawing] = useState(false);
	const { mousePos } = useStage();
	const { elementsArr, addElementToStage, myNewElement, setMyNewElement } =
		useElements();

	const { strokeColor, strokeWidth, opacity } = useToolSettings();

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (e.button !== 0) return;
			const { x, y } = mousePos;
			setPointsArr([x, y]);
			setDrawing(true);
		};
		const handleMouseMove = () => {
			if (!drawing) return;
			const { x, y } = mousePos;
			setPointsArr([...pointsArr, x, y]);
			setMyNewElement(
				<Line
					key={"Pencil" + elementsArr.length}
					points={pointsArr}
					strokeEnabled
					strokeWidth={strokeWidth}
					stroke={strokeColor}
					lineCap="round"
					opacity={opacity}
				/>
			);
		};
		const handleMouseUp = () => {
			addElementToStage();
			setDrawing(false);
		};
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [drawing, myNewElement, mousePos, pointsArr, elementsArr]);
	return null;
}
