import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Circle, Line, Rect, Text } from "react-konva";
import { useElements } from "../../providers/ElementsProvider";
import { useStage } from "../../providers/StageProvider";
import { useRef } from "react";
import { useTools } from "../../providers/ToolsProvider";

export default function MainElementsRenderer() {
	const { selectedToolRef } = useTools();

	const { elementsRef, removeElementFromStage } = useElements();

	const { stagePos } = useStage();

	const dragRef = useRef({
		isDragging: false,
		startPos: stagePos,
		endPos: stagePos,
	});

	return [...elementsRef.current.values()].map(({ shape }) => {
		if (!shape || !shape.key) return null;

		const { key } = shape;

		const { type, props } = shape;

		const handleDragStart = (
			e: KonvaEventObject<DragEvent, Node<NodeConfig>>
		) => {
			dragRef.current.isDragging = true;
			dragRef.current.startPos = { x: e.evt.clientX, y: e.evt.clientY };
			console.log(dragRef.current);
		};

		const handleDragEnd = (
			e: KonvaEventObject<DragEvent, Node<NodeConfig>>
		) => {
			dragRef.current.isDragging = false;

			dragRef.current.endPos = { x: e.evt.clientX, y: e.evt.clientY };

			console.log(dragRef.current);

			const posDiff = {
				x: dragRef.current.endPos.x - dragRef.current.startPos.x,
				y: dragRef.current.endPos.y - dragRef.current.startPos.y,
			};

			console.log(posDiff);
		};

		const draggable = selectedToolRef.current.name === "Pointer";

		switch (type) {
			case "Rect":
				return (
					<Rect
						key={key}
						{...props}
						onClick={() => removeElementFromStage(key)}
						draggable={draggable}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					/>
				);
			case "Circle":
				return (
					<Circle
						key={key}
						{...props}
						onClick={() => removeElementFromStage(key)}
						draggable={draggable}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					/>
				);
			case "Line":
				return (
					<Line
						key={key}
						{...props}
						onClick={() => removeElementFromStage(key)}
						draggable={draggable}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					/>
				);
			case "Text":
				return (
					<Text
						key={key}
						{...props}
						onClick={() => removeElementFromStage(key)}
						draggable={draggable}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					/>
				);
			default:
				return null;
		}
	});
}
