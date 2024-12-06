import { useEffect, useState } from "react";
import { Text } from "react-konva";
import { useStage } from "../../providers/StageProvider";
import { useElements } from "../../providers/ElementsProvider";
import { useToolSettings } from "../../providers/ToolSettingsProvider";
import { useMyNewElement } from "../../providers/MyNewElementProvider";

export default function TextHandler() {
	const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });

	const [drawing, setDrawing] = useState(false);

	const { getMousePos, stageScale } = useStage();
	const { elementsArrRef, removeElementFromStage } = useElements();
	const { myNewElement, setMyNewElement, handleCreatedElement } =
		useMyNewElement();

	const { strokeColor, opacity } = useToolSettings();

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
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [drawing, startingPosition, myNewElement]);

	const handleMouseDown = (e: MouseEvent) => {
		if (e.button !== 0) return;
		setDrawing(true);
		const { x, y } = getMousePos(e.clientX, e.clientY);

		const text = myNewElement
			? (myNewElement.props.text as string)
			: INITIAL_TEXT;
		const key = "Text" + elementsArrRef.current.length;
		setMyNewElement(
			<Text
				key={key}
				x={x}
				y={y}
				fill={strokeColor}
				text={text || INITIAL_TEXT}
				fontFamily="monospace"
				fontSize={25 / stageScale}
				opacity={opacity}
				onClick={() => removeElementFromStage(key)}
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
			handleCreatedElement();
			setDrawing(false);
			return;
		}
		const key = "Text" + elementsArrRef.current.length;
		setMyNewElement(
			<Text
				key={key}
				x={startingPosition.x}
				y={startingPosition.y}
				fill={strokeColor}
				text={newText || text}
				fontFamily="monospace"
				fontSize={25 / stageScale}
				opacity={opacity}
				onClick={() => removeElementFromStage(key)}
			/>
		);
	};

	return null;
}
