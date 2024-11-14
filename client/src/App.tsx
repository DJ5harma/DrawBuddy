import { Group, Layer, Rect, Stage } from "react-konva";
import TopNav from "./components/TopNav";

export default function App() {
	return (
		<>
			<TopNav />
			<Stage
				width={window.innerWidth}
				height={window.innerHeight}
				className="bg-neutral-900 overflow-hidden"
			>
				<Layer
					onClick={() => {
						console.log("CLICKED");
					}}
				>
					<Rect width={200} height={400} fill="red" x={90} y={90} draggable />
				</Layer>
			</Stage>
		</>
	);
}
