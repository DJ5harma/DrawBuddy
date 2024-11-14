import { Layer, Rect, Stage } from "react-konva";
import { useTools } from "../providers/ToolsProvider";

export default function StageInit() {
	const { selectedTool } = useTools();
	return (
		<Stage
			width={window.innerWidth}
			height={window.innerHeight}
			className="bg-neutral-900 overflow-hidden"
		>
			<Layer
				onClick={() => {
					console.log("CLICKED");
				}}
			>
				{selectedTool.handler}
			</Layer>
		</Stage>
	);
}
