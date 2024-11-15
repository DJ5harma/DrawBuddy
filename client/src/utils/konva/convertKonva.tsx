import { Circle, Line, Rect } from "react-konva";

export function serializeKonvaElement(element: JSX.Element) {
	const { type, props, key } = element;
	return JSON.stringify({ type, props, key });
}

export function deserializeKonvaElement(serial: string) {
	const { type, props, key } = JSON.parse(serial) as JSX.Element;
	switch (type) {
		case "Rect":
			return <Rect key={key} {...props} />;
		case "Circle":
			return <Circle key={key} {...props} />;
		case "Line":
			return <Line key={key} {...props} />;
		default:
			return <></>;
	}
}
