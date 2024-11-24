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
import RoomPointersHandler from "./handlers/functional/RoomPointersHandler";

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
							<StageProvider>
								<Routes>
									<Route index element={<CollaborateOption />} />
									<Route
										path="room/:id"
										element={
											<SocketProvider>
												<RoomHandler />
												<RoomPointersHandler />
											</SocketProvider>
										}
									/>
								</Routes>
							</StageProvider>
						</ElementsProvider>
					</ToolSettingsProvider>
				</ToolsProvider>
			</BrowserRouter>
		</>
	);
}
