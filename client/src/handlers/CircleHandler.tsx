import { ReactNode, useEffect, useState } from "react";
import { Circle } from "react-konva";
import { useTools } from "../providers/ToolsProvider";

export default function CircleHandler() {
	const [circlesArr, setCirclesArr] = useState<ReactNode[]>([]);
	const [newCircle, setNewCircle] = useState<JSX.Element | null>(null);
	const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });
	const [drawing, setDrawing] = useState(false);

	const { selectedTool } = useTools();

	const handleMouseDown = (e: MouseEvent) => {
		setDrawing(true);
		const { clientX: x, clientY: y } = e;
		setStartingPosition({ x, y });
	};
	const handleMouseMove = (e: MouseEvent) => {
		if (!drawing) return;

		const { clientX: x, clientY: y } = e;
		setNewCircle(
			<Circle
				key={Math.random()}
				x={startingPosition.x}
				y={startingPosition.y}
				radius={Math.sqrt(
					Math.pow(x - startingPosition.x, 2) +
						Math.pow(y - startingPosition.y, 2)
				)}
				strokeEnabled
				strokeWidth={4}
				stroke={"red"}
			/>
		);
	};
	const handleMouseUp = () => {
		const storeNewRect = newCircle;
		setNewCircle(null);
		setCirclesArr([...circlesArr, storeNewRect]);
		setDrawing(false);
	};

	useEffect(() => {
		if (selectedTool.name === "Circle") {
			document.addEventListener("mousedown", handleMouseDown);
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			return () => {
				document.removeEventListener("mousedown", handleMouseDown);
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}
	}, [drawing, startingPosition, newCircle, circlesArr, selectedTool]);

	if (newCircle) return [newCircle, ...circlesArr];
	return circlesArr;
}
