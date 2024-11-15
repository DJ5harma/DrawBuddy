import CircleHandler from "./handlers/CircleHandler";
import LineHandler from "./handlers/LineHandler";
import RectangleHandler from "./handlers/RectangleHandler";
import StageProvider from "./providers/StageProvider";
import ToolsProvider from "./providers/ToolsProvider";

export default function App() {
	return (
		<>
			<ToolsProvider>
				<StageProvider>
					<RectangleHandler />
					<CircleHandler />
					<LineHandler />
				</StageProvider>
			</ToolsProvider>
		</>
	);
}
