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
	SAMPLE_TOOL_SETTINGS,
	STROKE_COLORS,
} from "../utils/constants";
import { useTools } from "./ToolsProvider";

const toolSettings: IToolSettings = (() => {
	const ts = localStorage.getItem("toolSettings");
	if (!ts) return SAMPLE_TOOL_SETTINGS;
	return JSON.parse(ts);
})();

const context = createContext<IToolSettings>(SAMPLE_TOOL_SETTINGS);

export default function ToolSettingsProvider({
	children,
}: {
	children: ReactNode;
}) {
	const { selectedToolRef } = useTools();

	const [strokeColor, setStrokeColor] = useState(toolSettings.strokeColor);

	const [backgroundColor, setBackgroundColor] = useState(
		toolSettings.backgroundColor
	);

	const [strokeWidth, setStrokeWidth] = useState(toolSettings.strokeWidth);

	const [opacity, setOpacity] = useState(toolSettings.opacity);

	const [dashGap, setDashGap] = useState(toolSettings.dashGap);

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

	const Pallete = () => {
		switch (selectedToolRef.current.name) {
			case "Eraser":
				return null;
			case "Hand":
				return null;
			case "Gallery":
				return null;
			case "Pointer":
				return null;
		}
		return (
			<div
				className="absolute p-4 text-sm flex flex-col gap-4 [&>div]:gap-2 [&>div]:flex [&>div]:flex-col bg-neutral-800 my-auto w-fit z-10"
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
				{selectedToolRef.current.name !== "Pencil" &&
					selectedToolRef.current.name !== "Line" && (
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
						max={100}
						step={1}
						value={dashGap}
						onChange={(e) => setDashGap(e.target.valueAsNumber)}
					/>
				</div>
			</div>
		);
	};

	return (
		<>
			<Pallete />
			<context.Provider
				value={{ strokeColor, backgroundColor, strokeWidth, opacity, dashGap }}
			>
				{children}
			</context.Provider>
		</>
	);
}

export const useToolSettings = () => useContext(context);
