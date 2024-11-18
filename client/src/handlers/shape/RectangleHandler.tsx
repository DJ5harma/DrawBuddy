import { useEffect, useState } from "react";
import { Rect } from "react-konva";
import { useStage } from "../../providers/StageProvider";
import { useElements } from "../../providers/ElementsProvider";
import { useToolSettings } from "../../providers/ToolSettingsProvider";

export default function RectangleHandler() {
	const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });
	const [drawing, setDrawing] = useState(false);

	const { mousePos } = useStage();
	const { elementsArr, addElementToStage, myNewElement, setMyNewElement } =
		useElements();
	const { backgroundColor, strokeColor, strokeWidth, opacity } =
		useToolSettings();

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (e.button !== 0) return;
			setDrawing(true);
			setStartingPosition({ ...mousePos });
		};
		const handleMouseMove = () => {
			if (!drawing) return;
			setMyNewElement(
				<Rect
					key={"Rect" + elementsArr.length}
					x={startingPosition.x}
					y={startingPosition.y}
					width={mousePos.x - startingPosition.x}
					height={mousePos.y - startingPosition.y}
					strokeEnabled
					strokeWidth={strokeWidth}
					stroke={strokeColor}
					fill={backgroundColor}
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
	}, [drawing, startingPosition, myNewElement, mousePos]);
	return null;
}
