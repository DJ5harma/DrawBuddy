import { ReactNode, useState } from "react";
import { Rect } from "react-konva";

export default function RectangleHandler() {
	const [rectanglesArr, setRectanglesArr] = useState<ReactNode[]>([
		<Rect
			width={200}
			height={400}
			fill="red"
			x={90}
			y={90}
			draggable
			key={0}
		/>,
	]);
	return <>{rectanglesArr.map((element) => element)}</>;
}
