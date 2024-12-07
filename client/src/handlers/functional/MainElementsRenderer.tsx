import { Circle, Line, Rect, Text } from "react-konva";
import { useElements } from "../../providers/ElementsProvider";
import { useStage } from "../../providers/StageProvider";
import { useTools } from "../../providers/ToolsProvider";
import { useSocket } from "../../providers/SocketProvider";
import { useEffect, useRef } from "react";

export default function MainElementsRenderer() {
	const { socket } = useSocket();

	const { selectedToolRef } = useTools();

	const { elementsRef, removeElementFromStage, roomId } = useElements();

	const { getMousePos } = useStage();

	const posRef = useRef({ x: 0, y: 0 });

	useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	const handleMouseMove = (e: MouseEvent) => {
		posRef.current = getMousePos(e.clientX, e.clientY);
	};

	return [...elementsRef.current.values()].map((element) => {
		const { shape } = element;
		if (!shape || !shape.key) return null;

		const { key } = shape;

		const { type, props } = shape;

		const handleDragStart = () => {
			socket.emit("removed_element", {
				key,
				roomId,
			});
			socket.emit("creating_new_element", {
				element: shape,
				roomId,
			});
		};

		const handleDragMove = () => {
			socket.emit("creating_new_element", {
				element: {
					...shape,
					props: {
						...shape.props,
						...posRef.current,
					},
				},
				roomId,
			});
			// console.log(posRef.current, shape.props.x, shape.props.y);
		};

		const handleDragEnd = () => {
			socket.emit("finalized_new_element", {
				element: {
					...element,
					shape: {
						...shape,
						props: {
							...shape.props,
							...posRef.current,
						},
					},
				},
				roomId,
			});
			socket.emit("creating_new_element", {
				element: null,
				roomId,
			});
		};

		const draggable = selectedToolRef.current.name === "Pointer";

		switch (type) {
			case "Rect":
				return (
					<Rect
						key={key}
						{...props}
						onClick={() => removeElementFromStage(key, false)}
						draggable={draggable}
						onDragStart={handleDragStart}
						onDragMove={handleDragMove}
						onDragEnd={handleDragEnd}
					/>
				);
			case "Circle":
				return (
					<Circle
						key={key}
						{...props}
						onClick={() => removeElementFromStage(key, false)}
						draggable={draggable}
						onDragStart={handleDragStart}
						onDragMove={handleDragMove}
						onDragEnd={handleDragEnd}
					/>
				);
			case "Line":
				return (
					<Line
						key={key}
						{...props}
						onClick={() => removeElementFromStage(key, false)}
						draggable={draggable}
						onDragStart={handleDragStart}
						onDragMove={handleDragMove}
						onDragEnd={handleDragEnd}
					/>
				);
			case "Text":
				return (
					<Text
						key={key}
						{...props}
						onClick={() => removeElementFromStage(key, false)}
						draggable={draggable}
						onDragStart={handleDragStart}
						onDragMove={handleDragMove}
						onDragEnd={handleDragEnd}
					/>
				);
			default:
				return null;
		}
	});
}
