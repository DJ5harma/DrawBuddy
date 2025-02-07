import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
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
			<App />
		</BrowserRouter>
	</>
);
