import { Layer, Stage } from "react-konva";
import RectangleHandler from "../handlers/RectangleHandler";
import CircleHandler from "../handlers/CircleHandler";

export default function StageInit() {
	return (
		<Stage
			width={window.innerWidth}
			height={window.innerHeight}
			className="bg-neutral-900 overflow-hidden"
		>
			<Layer>
				<RectangleHandler />
				<CircleHandler />
			</Layer>
		</Stage>
	);
}
