import { Layer, Stage } from "react-konva";
import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { useTools } from "./ToolsProvider";
// import { serializeKonvaElement } from "../utils/konva/convertKonva";

const context = createContext<{
	elementsArr: JSX.Element[];
	setElementsArr: Dispatch<SetStateAction<JSX.Element[]>>;
	addElementToStage: (element: JSX.Element | null) => void;
}>({
	elementsArr: [],
	setElementsArr: () => {},
	addElementToStage: () => {},
});
export default function StageProvider() {
	const [elementsArr, setElementsArr] = useState<JSX.Element[]>([]);

	const addElementToStage = (element: JSX.Element | null) => {
		if (element) setElementsArr((p) => [...p, element]);
		// const storedShapesArray = JSON.parse(localStorage.getItem("storedShapesArray") || '[]') as Array<>;
		// if(!storedShapesArray) storedShapesArray = [serializeKonvaElement(element)]
	};

	useEffect(() => {
		localStorage.clear();
	}, []);

	useEffect(() => {
		window.addEventListener("resize", updateDimensions);
		return () => {
			window.removeEventListener("resize", updateDimensions);
		};
	}, []);
	const [dimensions, setDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const updateDimensions = () =>
		setDimensions({ width: window.innerWidth, height: window.innerHeight });

	const { selectedTool } = useTools();

	return (
		<Stage
			width={dimensions.width}
			height={dimensions.height}
			className="bg-neutral-900 overflow-hidden"
		>
			<Layer>
				{elementsArr}
				<context.Provider
					value={{ elementsArr, setElementsArr, addElementToStage }}
				>
					{selectedTool.handler}
				</context.Provider>
			</Layer>
		</Stage>
	);
}

export const useStage = () => useContext(context);
