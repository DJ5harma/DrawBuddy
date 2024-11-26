import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { IToolSettings } from "../utils/types";
import {
	BACKGROUND_COLORS,
	sampleToolSettings,
	STROKE_COLORS,
} from "../utils/constants";
import { useTools } from "./ToolsProvider";

const toolSettings: IToolSettings = (() => {
	const ts = localStorage.getItem("toolSettings");
	if (!ts) return sampleToolSettings;
	return JSON.parse(ts);
})();
export default function ToolSettingsProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [strokeColor, setStrokeColor] = useState(toolSettings.strokeColor);
	const [backgroundColor, setBackgroundColor] = useState(
		toolSettings.backgroundColor
	);

	const [strokeWidth, setStrokeWidth] = useState(toolSettings.strokeWidth);
	const [opacity, setOpacity] = useState(toolSettings.opacity);
	const [dashGap, setDashGap] = useState(toolSettings.dashGap);

	const { selectedTool } = useTools();

	useEffect(() => {
		localStorage.setItem(
			"toolSettings",
			JSON.stringify({
				strokeColor,
				backgroundColor,
				strokeWidth,
				opacity,
				dashGap,
			})
		);
	}, [strokeColor, strokeWidth, backgroundColor, opacity, dashGap]);
	return (
		<>
			<div className="fixed left-4 h-screen flex items-center z-50">
				<div
					className="border-4 p-4 text-sm flex flex-col gap-4 [&>div]:gap-2 [&>div]:flex [&>div]:flex-col bg-neutral-800"
					style={{ top: "10vh" }}
					onMouseDown={(e) => e.stopPropagation()}
				>
					<div>
						<p>Stroke</p>
						<div className="flex gap-1">
							{STROKE_COLORS.map((color) => (
								<button
									key={color}
									className={`px-4 h-6 rounded-lg ${
										strokeColor === color
											? "border-2 border-dotted border-black"
											: ""
									}`}
									style={color ? { backgroundColor: color } : {}}
									onClick={() => setStrokeColor(color)}
								>
									{!color && "T"}
								</button>
							))}
						</div>
						<input
							className="cursor-pointer"
							type="range"
							min={0}
							max={30}
							value={strokeWidth}
							onChange={(e) => setStrokeWidth(e.target.valueAsNumber)}
						/>
					</div>
					{selectedTool.name !== "Pencil" && selectedTool.name !== "Line" && (
						<div>
							<p>Background</p>
							<div className="flex gap-1">
								{BACKGROUND_COLORS.map((color) => (
									<button
										key={color}
										className={`px-4 h-6 rounded-lg ${
											backgroundColor === color
												? "border-2 border-dotted border-black"
												: ""
										}`}
										style={color ? { backgroundColor: color } : {}}
										onClick={() => setBackgroundColor(color)}
									>
										{!color && "T"}
									</button>
								))}
							</div>
						</div>
					)}
					<div>
						<p>Opacity</p>
						<input
							className="cursor-pointer"
							type="range"
							min={0.05}
							max={1}
							step={0.01}
							value={opacity}
							onChange={(e) => setOpacity(e.target.valueAsNumber)}
						/>
					</div>
					<div>
						<p>Dash Gap</p>
						<input
							className="cursor-pointer"
							type="range"
							min={0}
							max={30}
							step={1}
							value={dashGap}
							onChange={(e) => setDashGap(e.target.valueAsNumber)}
						/>
					</div>
				</div>
			</div>
			<context.Provider
				value={{ strokeColor, backgroundColor, strokeWidth, opacity, dashGap }}
			>
				{children}
			</context.Provider>
		</>
	);
}

const context = createContext<IToolSettings>(sampleToolSettings);
export const useToolSettings = () => useContext(context);
