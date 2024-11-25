import { useEffect, useState } from "react";
import { Circle } from "react-konva";
import { useStage } from "../../providers/StageProvider";
import { useElements } from "../../providers/ElementsProvider";
import { useToolSettings } from "../../providers/ToolSettingsProvider";
import { useMyNewElement } from "../../providers/MyNewElementProvider";

export default function CircleHandler() {
	const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });
	const [drawing, setDrawing] = useState(false);

	const { getMousePos } = useStage();
	const { elementsArrRef, addElementToStage } = useElements();
	const { myNewElement, setMyNewElement } = useMyNewElement();

	const { backgroundColor, strokeColor, strokeWidth, opacity } =
		useToolSettings();

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (e.button !== 0) return;
			setDrawing(true);
			const { x, y } = getMousePos(e.clientX, e.clientY);
			setStartingPosition({ x, y });
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (!drawing) return;
			const { x, y } = getMousePos(e.clientX, e.clientY);
			setMyNewElement(
				<Circle
					key={"Circle" + elementsArrRef.current.length}
					x={startingPosition.x}
					y={startingPosition.y}
					radius={Math.sqrt(
						Math.pow(x - startingPosition.x, 2) +
							Math.pow(y - startingPosition.y, 2)
					)}
					strokeEnabled
					strokeWidth={strokeWidth}
					stroke={strokeColor}
					fill={backgroundColor}
					opacity={opacity}
				/>
			);
		};

		const handleMouseUp = () => {
			addElementToStage(myNewElement);
			setDrawing(false);
			setMyNewElement(null);
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

	return myNewElement || <></>;
}
