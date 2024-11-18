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

const context = createContext<{
	strokeColor: string;
	backgroundColor: string;
	strokeWidth: number;
}>({
	strokeColor: strokeColors[0],
	backgroundColor: backgroundColors[0],
	strokeWidth: 10,
});

export default function ToolSettingsProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [strokeColor, setStrokeColor] = useState(strokeColors[0]);
	const [backgroundColor, setBackgroundColor] = useState(backgroundColors[0]);

	const [strokeWidth, setStrokeWidth] = useState(10);
	const [backgroundOpacity, setBackgroundOpacity] = useState(0.5);

	useEffect(() => {
		localStorage.setItem(
			"toolSettings",
			JSON.stringify({
				strokeColor,
				backgroundColor,
				strokeWidth,
			})
		);
	}, [strokeColor, strokeWidth, backgroundColor]);
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
			</div>
			<context.Provider value={{ strokeColor, backgroundColor, strokeWidth }}>
				{children}
			</context.Provider>
		</>
	);
}

export const useToolSettings = () => useContext(context);
