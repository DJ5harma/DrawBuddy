import { useEffect, useState } from "react";
import { Rect } from "react-konva";
import { useStage } from "../../providers/StageProvider";
import { useElements } from "../../providers/ElementsProvider";
import { useToolSettings } from "../../providers/ToolSettingsProvider";

export default function RectangleHandler() {
	const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });
	const [drawing, setDrawing] = useState(false);

	const { getMousePos } = useStage();
	const { elementsArr, addElementToStage, myNewElement, setMyNewElement } =
		useElements();
	const { backgroundColor, strokeColor, strokeWidth, opacity } =
		useToolSettings();

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			console.log(e.button);

			if (e.button !== 0) return;
			setDrawing(true);
			setStartingPosition(getMousePos(e.clientX, e.clientY));
		};
		const handleMouseMove = (e: MouseEvent) => {
			if (!drawing) return;
			const { x, y } = getMousePos(e.clientX, e.clientY);
			setMyNewElement(
				<Rect
					key={"Rect" + elementsArr.length}
					x={startingPosition.x}
					y={startingPosition.y}
					width={x - startingPosition.x}
					height={y - startingPosition.y}
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
	}, [drawing, startingPosition, myNewElement]);
	return null;
}
