import { useEffect, useState } from "react";
import { Text } from "react-konva";
import { useStage } from "../../providers/StageProvider";
import { useElements } from "../../providers/ElementsProvider";
import { useToolSettings } from "../../providers/ToolSettingsProvider";
import { useMyNewElement } from "../../providers/MyNewElementProvider";

export default function TextHandler() {
	const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });

	const [drawing, setDrawing] = useState(false);

	const { getMousePos, getStageScale } = useStage();
	const { elementsArrRef, addElementToStage } = useElements();
	const { getMyNewElement, setMyNewElement } = useMyNewElement();

	const { strokeColor, opacity } = useToolSettings();

	const INITIAL_TEXT = "Type (Esc to stop)...";

	useEffect(() => {
		if (!drawing) return;
		setMyNewElement((p) => (
			<Text
				{...p?.props}
				fill={strokeColor}
				fontSize={25 / getStageScale()}
				opacity={opacity}
			/>
		));
	}, [strokeColor, opacity]);

	useEffect(() => {
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [drawing, startingPosition]);

	const handleMouseDown = (e: MouseEvent) => {
		if (e.button !== 0) return;
		setDrawing(true);
		const { x, y } = getMousePos(e.clientX, e.clientY);

		const elem = getMyNewElement();
		const text = elem ? (elem.props.text as string) : INITIAL_TEXT;
		setMyNewElement(
			<Text
				key={"Text" + elementsArrRef.current.length}
				x={x}
				y={y}
				fill={strokeColor}
				text={text || INITIAL_TEXT}
				fontFamily="monospace"
				fontSize={25 / getStageScale()}
				opacity={opacity}
			/>
		);
		setStartingPosition({ x, y });
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (!drawing) return;
		const elem = getMyNewElement();
		let text = elem?.props.text as string;
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
			addElementToStage(elem);
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
				fontSize={25 / getStageScale()}
				opacity={opacity}
			/>
		);
	};

	return null;
}
