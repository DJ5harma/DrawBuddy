import { useEffect, useState } from "react";
import { Rect } from "react-konva";
import { useStage } from "../../providers/StageProvider";
import { useToolSettings } from "../../providers/ToolSettingsProvider";
import { useMyNewElement } from "../../providers/MyNewElementProvider";

export default function RectangleHandler() {
	const { backgroundColor, strokeColor, strokeWidth, opacity, dashGap } =
		useToolSettings();

	const { getMousePos } = useStage();

	const { myNewElement, setMyNewElement, handleCreatedElement } =
		useMyNewElement();

	const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });

	const [drawing, setDrawing] = useState(false);

	useEffect(() => {
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [drawing, startingPosition, myNewElement]);

	const handleMouseDown = (e: MouseEvent) => {
		if (e.button !== 0) return;
		setDrawing(true);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!drawing) return;

		const { x, y } = getMousePos(e.clientX, e.clientY);

		if (!startingPosition.x && !startingPosition.y) {
			setStartingPosition(getMousePos(e.clientX, e.clientY));
			return;
		}

		setMyNewElement(
			<Rect
				key={Date.now()}
				x={startingPosition.x}
				y={startingPosition.y}
				width={x - startingPosition.x}
				height={y - startingPosition.y}
				strokeEnabled
				strokeWidth={strokeWidth}
				stroke={strokeColor}
				fill={backgroundColor}
				opacity={opacity}
				dashEnabled={dashGap > 0}
				dash={[dashGap + strokeWidth]}
			/>
		);
	};

	const handleMouseUp = () => {
		handleCreatedElement();
		setDrawing(false);
		setStartingPosition({ x: 0, y: 0 });
	};

	return null;
}
