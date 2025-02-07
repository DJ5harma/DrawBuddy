import { Route, Routes } from "react-router-dom";
import ElementsProvider from "./providers/ElementsProvider";
import SocketProvider from "./providers/SocketProvider";
import StageProvider from "./providers/StageProvider";
import ToolSettingsProvider from "./providers/ToolSettingsProvider";
import ToolsProvider from "./providers/ToolsProvider";
import CollaborateOption from "./components/CollaborateOption";
import ClearAllButton from "./components/ClearAllButton";
import MyNewElementProvider from "./providers/MyNewElementProvider";
import RoomInit from "./room/RoomInit";
import ElementListeners from "./room/ElementListeners";
import MainElementsRenderer from "./handlers/functional/MainElementsRenderer";
import { Group } from "react-konva";
import NavMenu from "./components/NavMenu";

export default function App() {
	return (
		<div className="select-none">
			<SocketProvider>
				<ToolsProvider>
					<ToolSettingsProvider>
						<ElementsProvider>
							<NavMenu />
							<ClearAllButton />
							<CollaborateOption />
							<StageProvider>
								<Group>
									<MainElementsRenderer />
								</Group>
								<Group>
									<MyNewElementProvider />
								</Group>
								<Routes>
									<Route index element={<></>} />
									<Route
										path="room/:id"
										element={
											<Group>
												<RoomInit />

												<ElementListeners />
											</Group>
										}
									/>
								</Routes>
							</StageProvider>
						</ElementsProvider>
					</ToolSettingsProvider>
				</ToolsProvider>
			</SocketProvider>
		</div>
	);
}
