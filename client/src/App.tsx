import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavMenu from "./components/NavMenu";
import ElementsProvider from "./providers/ElementsProvider";
import SocketProvider from "./providers/SocketProvider";
import StageProvider from "./providers/StageProvider";
import ToolSettingsProvider from "./providers/ToolSettingsProvider";
import ToolsProvider from "./providers/ToolsProvider";
import RoomHandler from "./handlers/functional/RoomHandler";
import { Toaster } from "react-hot-toast";
import CollaborateOption from "./components/CollaborateOption";
import ClearAllButton from "./components/ClearAllButton";

export default function App() {
	return (
		<>
			<Toaster
				toastOptions={{ style: { backgroundColor: "black", color: "white" } }}
				position="bottom-center"
			/>
			<BrowserRouter
				future={{
					v7_startTransition: true,
					v7_relativeSplatPath: true,
				}}
			>
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
												<></>
											</StageProvider>
										</>
									}
								/>
								<Route
									path="room/:id"
									element={
										<SocketProvider>
											<StageProvider>
												<RoomHandler />
											</StageProvider>
											<ClearAllButton />
										</SocketProvider>
									}
								/>
							</Routes>
						</ElementsProvider>
					</ToolSettingsProvider>
				</ToolsProvider>
			</BrowserRouter>
		</>
	);
}
