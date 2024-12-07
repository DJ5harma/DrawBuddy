import { Circle, Line, Rect, Text } from "react-konva";
import { useElements } from "../../providers/ElementsProvider";
import { useStage } from "../../providers/StageProvider";
import { useTools } from "../../providers/ToolsProvider";
import { useSocket } from "../../providers/SocketProvider";
import { useEffect, useState } from "react";
import { deserializeKonvaElement } from "../../utils/konva/convertKonva";

export default function MainElementsRenderer() {
	const { socket } = useSocket();

	const { selectedToolRef } = useTools();

	const { elementsRef, addElementToStage, removeElementFromStage, roomId } =
		useElements();

	const { getMousePos, stagePos, stageScale } = useStage();

	const [draggingShape, setDraggingShape] = useState<JSX.Element | null>(null);

	useEffect(() => {
		document.addEventListener("mousemove", handleDragMove);
		document.addEventListener("mouseup", handleDragEnd);
		return () => {
			document.removeEventListener("mousemove", handleDragMove);
			document.removeEventListener("mouseup", handleDragEnd);
		};
	}, [draggingShape]);

	const handleDragMove = (e: MouseEvent) => {
		if (!draggingShape) return;
		const { x, y } = getMousePos(e.clientX, e.clientY);

		const shape = {
			...draggingShape,
			props: { ...draggingShape.props, x, y },
		};

		setDraggingShape(shape);

		socket.emit("creating_new_element", {
			element: shape,
			roomId,
		});
	};
	const handleDragEnd = (e: MouseEvent) => {
		if (!draggingShape) return;

		const { x, y } = getMousePos(e.clientX, e.clientY);

		const newShape = {
			...draggingShape,
			props: { ...draggingShape.props, x, y },
		};

		addElementToStage({ shape: newShape, stagePos, stageScale }, false);

		socket.emit("creating_new_element", {
			element: null,
			roomId,
		});

		setDraggingShape(null);
	};

	return (
		<>
			{[...elementsRef.current.values()].map((element) => {
				const { shape } = element;
				if (!shape || !shape.key) return null;

				const { key } = shape;

				const { type, props } = shape;

				const handleDragStart = () => {
					if (selectedToolRef.current.name !== "Pointer" || !key) return;
					setDraggingShape(shape);
				};
				switch (type) {
					case "Rect":
						return (
							<Rect
								key={key}
								{...props}
								onClick={() => removeElementFromStage(key, false)}
								onMouseDown={handleDragStart}
							/>
						);
					case "Circle":
						return (
							<Circle
								key={key}
								{...props}
								onClick={() => removeElementFromStage(key, false)}
								onMouseDown={handleDragStart}
							/>
						);
					case "Line":
						return (
							<Line
								key={key}
								{...props}
								onClick={() => removeElementFromStage(key, false)}
								onMouseDown={handleDragStart}
							/>
						);
					case "Text":
						return (
							<Text
								key={key}
								{...props}
								onClick={() => removeElementFromStage(key, false)}
								onMouseDown={handleDragStart}
							/>
						);
					default:
						return null;
				}
			})}
			{draggingShape ? deserializeKonvaElement(draggingShape) : null}
		</>
	);
}
