import ElementsProvider from "./providers/ElementsProvider";
import StageProvider from "./providers/StageProvider";
import ToolSettingsProvider from "./providers/ToolSettingsProvider";
import ToolsProvider from "./providers/ToolsProvider";

export default function App() {
	return (
		<>
			<ElementsProvider>
				<ToolsProvider>
					<ToolSettingsProvider>
						<StageProvider />
					</ToolSettingsProvider>
				</ToolsProvider>
			</ElementsProvider>
		</>
	);
}
