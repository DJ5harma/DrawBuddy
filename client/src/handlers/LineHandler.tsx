import { useEffect, useState } from "react";
import { Line } from "react-konva";
import { useTools } from "../providers/ToolsProvider";
import { useStage } from "../providers/StageProvider";

export default function LineHandler() {
	const [NewLine, setNewLine] = useState<JSX.Element | null>(null);
	const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });
	const [drawing, setDrawing] = useState(false);

	const { selectedTool } = useTools();
	const { addElementToStage } = useStage();

	const handleMouseDown = (e: MouseEvent) => {
		setDrawing(true);
		const { clientX: x, clientY: y } = e;
		setStartingPosition({ x, y });
	};
	const handleMouseMove = (e: MouseEvent) => {
		if (!drawing) return;

		const { clientX: x, clientY: y } = e;
		setNewLine(
			<Line
				key={Math.random()}
				points={[startingPosition.x, startingPosition.y, x, y]}
				strokeEnabled
				strokeWidth={4}
				stroke={"red"}
			/>
		);
	};
	const handleMouseUp = () => {
		const newElem = NewLine;
		setNewLine(null);
		addElementToStage(newElem);
		setDrawing(false);
	};

	useEffect(() => {
		if (selectedTool.name === "Line") {
			document.addEventListener("mousedown", handleMouseDown);
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			return () => {
				document.removeEventListener("mousedown", handleMouseDown);
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}
	}, [drawing, startingPosition, NewLine, selectedTool]);

	return NewLine;
}
