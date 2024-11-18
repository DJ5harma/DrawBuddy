import { ReactNode } from "react";
import { Circle, Line, Rect } from "react-konva";

export function serializeKonvaElement(element: JSX.Element) {
	const { type, props, key } = element;
	return { type, props, key };
}

export function deserializeKonvaElement(serial: JSX.Element): ReactNode {
	const { type, props, key } = serial;
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
