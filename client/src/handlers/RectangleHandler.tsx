import { useEffect, useState } from "react";
import { Rect } from "react-konva";
import { useStage } from "../providers/StageProvider";

export default function RectangleHandler() {
	const [NewRectangle, setNewRectangle] = useState<JSX.Element | null>(null);
	const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });
	const [drawing, setDrawing] = useState(false);

	const { addElementToStage, mousePos } = useStage();

	useEffect(() => {
		const handleMouseDown = () => {
			setDrawing(true);
			setStartingPosition({ ...mousePos });
		};
		const handleMouseMove = () => {
			if (!drawing) return;
			setNewRectangle(
				<Rect
					key={Math.random()}
					x={startingPosition.x}
					y={startingPosition.y}
					width={mousePos.x - startingPosition.x}
					height={mousePos.y - startingPosition.y}
					strokeEnabled
					strokeWidth={4}
					stroke={"red"}
				/>
			);
		};
		const handleMouseUp = () => {
			addElementToStage(NewRectangle);
			setNewRectangle(null);
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
	}, [drawing, startingPosition, NewRectangle, mousePos]);

	if (NewRectangle) return NewRectangle;
}
