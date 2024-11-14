import { Layer, Rect, Stage } from "react-konva";
import { useTools } from "../providers/ToolsProvider";
import RectangleHandler from "../handlers/RectangleHandler";

export default function StageInit() {
	const { selectedTool } = useTools();
	return (
		<Stage
			width={window.innerWidth}
			height={window.innerHeight}
			className="bg-neutral-900 overflow-hidden"
		>
			<Layer>
				<RectangleHandler />
			</Layer>
		</Stage>
	);
}
