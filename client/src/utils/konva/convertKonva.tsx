import { Circle, Line, Rect, Text } from "react-konva";

export function serializeKonvaElement(element: JSX.Element): JSX.Element {
	const { type, props, key } = element;
	return { type, props, key };
}

export function deserializeKonvaElement(serial: JSX.Element): JSX.Element {
	const { type, props, key } = serial;
	switch (type) {
		case "Rect":
			return <Rect key={key} {...props} />;
		case "Circle":
			return <Circle key={key} {...props} />;
		case "Line":
			return <Line key={key} {...props} />;
		case "Text":
			return <Text key={key} {...props} />;
		default:
			return <></>;
	}
}
export function getShapeEnds(shape: JSX.Element): { x: number; y: number } {
	const { type, props } = shape;
	switch (type) {
		case "Rect":
			return {
				x: props.x + props.width,
				y: props.y + props.height,
			};
		case "Circle":
			return {
				x: props.x + props.radius,
				y: props.y,
			};
		case "Line": {
			const ptsArray = props.points as [];
			if (ptsArray.length < 2) return { x: 0, y: 0 };
			return {
				x: ptsArray[ptsArray.length - 2],
				y: ptsArray[ptsArray.length - 1],
			};
		}
		default:
			return { x: 0, y: 0 };
	}
}
