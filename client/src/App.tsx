import ElementsProvider from "./providers/ElementsProvider";
import StageProvider from "./providers/StageProvider";
import ToolsProvider from "./providers/ToolsProvider";

export default function App() {
	return (
		<>
			<ElementsProvider>
				<ToolsProvider>
					<StageProvider />
				</ToolsProvider>
			</ElementsProvider>
		</>
	);
}
