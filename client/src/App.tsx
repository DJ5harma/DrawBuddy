import StageProvider from "./providers/StageProvider";
import ToolsProvider from "./providers/ToolsProvider";

export default function App() {
	return (
		<>
			<ToolsProvider>
				<StageProvider />
			</ToolsProvider>
		</>
	);
}
