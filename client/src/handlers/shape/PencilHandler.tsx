import { useEffect, useState } from "react";
import { Line } from "react-konva";
import { useStage } from "../../providers/StageProvider";
import { useToolSettings } from "../../providers/ToolSettingsProvider";
import { useMyNewElement } from "../../providers/MyNewElementProvider";

export default function PencilHandler() {
	const { strokeColor, strokeWidth, opacity, dashGap } = useToolSettings();

	const { getMousePos } = useStage();

	const { myNewElement, setMyNewElement, handleCreatedElement } =
		useMyNewElement();

	const [pointsArr, setPointsArr] = useState<number[]>([]);

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
	}, [drawing, myNewElement, pointsArr]);

	const handleMouseDown = (e: MouseEvent) => {
		if (e.button !== 0) return;
		setDrawing(true);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!drawing) return;

		const { x, y } = getMousePos(e.clientX, e.clientY);

		setPointsArr([...pointsArr, x, y]);

		setMyNewElement(
			<Line
				key={Date.now()}
				points={[...pointsArr, x, y]}
				strokeEnabled
				strokeWidth={strokeWidth}
				stroke={strokeColor}
				lineCap="round"
				opacity={opacity}
				dashEnabled={dashGap > 0}
				dash={[dashGap + strokeWidth]}
			/>
		);
	};

	const handleMouseUp = () => {
		setDrawing(false);
		handleCreatedElement();
		setPointsArr([]);
	};

	return null;
}
