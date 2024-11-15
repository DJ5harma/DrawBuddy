import { useEffect, useState } from "react";
import { Rect } from "react-konva";
import { useStage } from "../providers/StageProvider";

export default function RectangleHandler() {
	const [NewRectangle, setNewRectangle] = useState<JSX.Element | null>(null);
	const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });
	const [drawing, setDrawing] = useState(false);

	const { addElementToStage } = useStage();

	const handleMouseDown = (e: MouseEvent) => {
		setDrawing(true);
		const { clientX: x, clientY: y } = e;
		setStartingPosition({ x, y });
	};
	const handleMouseMove = (e: MouseEvent) => {
		if (!drawing) return;

		const { clientX: x, clientY: y } = e;
		setNewRectangle(
			<Rect
				key={Math.random()}
				x={startingPosition.x}
				y={startingPosition.y}
				width={x - startingPosition.x}
				height={y - startingPosition.y}
				strokeEnabled
				strokeWidth={4}
				stroke={"red"}
			/>
		);
	};
	const handleMouseUp = () => {
		const newElem = NewRectangle;

		setNewRectangle(null);
		addElementToStage(newElem);
		setDrawing(false);
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [drawing, startingPosition, NewRectangle]);

	if (NewRectangle) return NewRectangle;
}
