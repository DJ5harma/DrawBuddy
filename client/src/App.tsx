import NavMenu from "./components/NavMenu";
import ElementsProvider from "./providers/ElementsProvider";
import SocketProvider from "./providers/SocketProvider";
import StageProvider from "./providers/StageProvider";
import ToolSettingsProvider from "./providers/ToolSettingsProvider";
import ToolsProvider from "./providers/ToolsProvider";

export default function App() {
	return (
		<SocketProvider>
			<ElementsProvider>
				<ToolsProvider>
					<ToolSettingsProvider>
						<StageProvider />
						<NavMenu />
					</ToolSettingsProvider>
				</ToolsProvider>
			</ElementsProvider>
		</SocketProvider>
	);
}
