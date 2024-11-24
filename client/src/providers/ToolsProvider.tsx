import { createContext, ReactNode, useContext, useState } from "react";
import { ITool } from "../utils/types";
import { toolArr } from "../utils/constants";

export default function ToolsProvider({ children }: { children: ReactNode }) {
	const [selectedTool, setSelectedTool] = useState<ITool>(
		toolArr[parseInt(localStorage.getItem("selectedToolIndex") || "2")]
	);

	return (
		<context.Provider value={{ selectedTool }}>
			<div
				className="w-screen absolute top-4 left-0 flex justify-center items-center z-10"
				style={{
					transform: "scale(1)",
				}}
			>
				<nav className="top-2 bg-neutral-800 flex p-1 [&>button]:p-3 gap-1">
					{toolArr.map((tool, i) => (
						<button
							onClick={() => {
								localStorage.setItem("selectedToolIndex", i.toString());
								setSelectedTool(tool);
							}}
							className={
								selectedTool.name === tool.name
									? "bg-orange-900"
									: "hover:bg-neutral-700"
							}
							key={tool.name}
						>
							{tool.icon}
						</button>
					))}
				</nav>
			</div>
			{children}
		</context.Provider>
	);
}

const context = createContext<{ selectedTool: ITool }>({
	selectedTool: toolArr[2],
});

export const useTools = () => useContext(context);
