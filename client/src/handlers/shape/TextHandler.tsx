import { useEffect, useState } from "react";
import { Text } from "react-konva";
import { useStage } from "../../providers/StageProvider";
import { useElements } from "../../providers/ElementsProvider";
import { useToolSettings } from "../../providers/ToolSettingsProvider";
import { useMyNewElement } from "../../providers/MyNewElementProvider";

export default function CircleHandler() {
	const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });

	const [drawing, setDrawing] = useState(false);

	const { getMousePos, stageScale } = useStage();
	const { elementsArrRef, addElementToStage } = useElements();
	const { myNewElement, setMyNewElement } = useMyNewElement();

	const { backgroundColor, strokeColor, strokeWidth, opacity, dashGap } =
		useToolSettings();

	const INITIAL_TEXT = "Type (Esc to stop)...";

	useEffect(() => {
		if (!drawing) return;
		setMyNewElement((p) => (
			<Text
				{...p?.props}
				fill={strokeColor}
				fontSize={25 / stageScale}
				opacity={opacity}
			/>
		));
	}, [stageScale, strokeColor, opacity]);

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (e.button !== 0) return;
			setDrawing(true);
			const { x, y } = getMousePos(e.clientX, e.clientY);

			const text = myNewElement
				? (myNewElement.props.text as string)
				: INITIAL_TEXT;
			setMyNewElement(
				<Text
					key={"Text" + elementsArrRef.current.length}
					x={x}
					y={y}
					fill={strokeColor}
					text={text || INITIAL_TEXT}
					fontFamily="monospace"
					fontSize={25 / stageScale}
					opacity={opacity}
				/>
			);
			setStartingPosition({ x, y });
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (!drawing) return;

			let text = myNewElement?.props.text as string;
			let newText = "";

			if (e.key.length === 1)
				newText = text === INITIAL_TEXT ? e.key : text + e.key;
			else if (e.key === "Delete") {
				setMyNewElement(null);
				setDrawing(false);
				return;
			} else if (e.key === "Backspace" && e.ctrlKey) text = "";
			else if (e.key === "Backspace") {
				newText = text.slice(0, text.length - 1);
				if (!newText) text = "";
			} else if (e.key === "Escape") {
				addElementToStage(myNewElement);
				setMyNewElement(null);
				setDrawing(false);
				return;
			}
			setMyNewElement(
				<Text
					key={"Text" + elementsArrRef.current.length}
					x={startingPosition.x}
					y={startingPosition.y}
					fill={strokeColor}
					text={newText || text}
					fontFamily="monospace"
					fontSize={25 / stageScale}
					opacity={opacity}
				/>
			);
		};

		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [drawing, startingPosition, myNewElement]);

	return null;
}
