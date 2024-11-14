import CircleHandler from "./handlers/CircleHandler";
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
				</StageProvider>
			</ToolsProvider>
		</>
	);
}
