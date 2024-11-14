import ToolsProvider from "./providers/ToolsProvider";
import StageInit from "./components/StageInit";

export default function App() {
	return (
		<>
			<ToolsProvider>
				<StageInit />
			</ToolsProvider>
		</>
	);
}
