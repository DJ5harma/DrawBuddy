import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

const strokeColors = [
	"rgb(255,40,40)",
	"rgb(60,255,60)",
	"rgb(60,60,255)",
	"yellow",
	"orange",
	"",
];
const backgroundColors = [
	"rgb(255, 201, 201)",
	"rgb(178, 242, 187)",
	"rgb(165, 216, 255)",
	"rgb(255, 236, 153)",
	"",
];

interface IToolSettings {
	strokeColor: string;
	backgroundColor: string;
	strokeWidth: number;
	opacity: number;
}

const sampleToolSettings = {
	strokeColor: strokeColors[0],
	backgroundColor: backgroundColors[0],
	strokeWidth: 10,
	opacity: 1,
};

const context = createContext<IToolSettings>(sampleToolSettings);

export default function ToolSettingsProvider({
	children,
}: {
	children: ReactNode;
}) {
	const toolSettings: IToolSettings = (() => {
		const ts = localStorage.getItem("toolSettings");
		if (!ts) return sampleToolSettings;
		return JSON.parse(ts);
	})();
	const [strokeColor, setStrokeColor] = useState(toolSettings.strokeColor);
	const [backgroundColor, setBackgroundColor] = useState(
		toolSettings.backgroundColor
	);

	const [strokeWidth, setStrokeWidth] = useState(toolSettings.strokeWidth);
	const [opacity, setOpacity] = useState(toolSettings.opacity);

	useEffect(() => {
		localStorage.setItem(
			"toolSettings",
			JSON.stringify({
				strokeColor,
				backgroundColor,
				strokeWidth,
				opacity,
			})
		);
	}, [strokeColor, strokeWidth, backgroundColor, opacity]);
	return (
		<>
			<div
				className="absolute left-4 border-4 p-4 text-sm flex flex-col gap-4 [&>div]:gap-2 [&>div]:flex [&>div]:flex-col z-50 bg-neutral-800"
				style={{ top: "10vh" }}
				onMouseDown={(e) => e.stopPropagation()}
			>
				<div>
					<p>Stroke</p>
					<div className="flex gap-1">
						{strokeColors.map((color) => (
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
						type="range"
						min={0}
						max={30}
						value={strokeWidth}
						onChange={(e) => setStrokeWidth(e.target.valueAsNumber)}
					/>
				</div>
				<div>
					<p>Background</p>
					<div className="flex gap-1">
						{backgroundColors.map((color) => (
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
				<div>
					<p>Opacity</p>
					<input
						type="range"
						min={0.05}
						max={1}
						step={0.01}
						value={opacity}
						onChange={(e) => setOpacity(e.target.valueAsNumber)}
					/>
				</div>
			</div>
			<context.Provider
				value={{ strokeColor, backgroundColor, strokeWidth, opacity }}
			>
				{children}
			</context.Provider>
		</>
	);
}

export const useToolSettings = () => useContext(context);