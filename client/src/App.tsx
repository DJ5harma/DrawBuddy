import { Route, Routes } from "react-router-dom";
import NavMenu from "./components/NavMenu";
import ElementsProvider from "./providers/ElementsProvider";
import SocketProvider from "./providers/SocketProvider";
import StageProvider from "./providers/StageProvider";
import ToolSettingsProvider from "./providers/ToolSettingsProvider";
import ToolsProvider from "./providers/ToolsProvider";
import CollaborateOption from "./components/CollaborateOption";
import ClearAllButton from "./components/ClearAllButton";
import MyNewElementProvider from "./providers/MyNewElementProvider";
import ElementEmitters from "./room/ElementEmmiters";
import RoomInit from "./room/RoomInit";
import ElementListeners from "./room/ElementListeners";

export default function App() {
	return (
		<ToolsProvider>
			<ToolSettingsProvider>
				<ElementsProvider>
					<NavMenu />
					<Routes>
						<Route
							index
							element={
								<>
									<CollaborateOption />
									<ClearAllButton />

									<StageProvider>
										<MyNewElementProvider />
									</StageProvider>
								</>
							}
						/>
						<Route
							path="room/:id"
							element={
								<SocketProvider>
									<ClearAllButton />

									<StageProvider>
										<MyNewElementProvider>
											<RoomInit />
											<ElementListeners />
											<ElementEmitters />
										</MyNewElementProvider>
									</StageProvider>
								</SocketProvider>
							}
						/>
					</Routes>
				</ElementsProvider>
			</ToolSettingsProvider>
		</ToolsProvider>
	);
}
