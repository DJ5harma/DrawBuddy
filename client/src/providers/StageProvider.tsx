import { Layer, Stage } from "react-konva";
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

const context = createContext<{
	elementsArr: ReactNode[];
	setElementsArr: Dispatch<SetStateAction<ReactNode[]>>;
	addElementToStage: (element: ReactNode) => void;
}>({
	elementsArr: [],
	setElementsArr: () => {},
	addElementToStage: () => {},
});
export default function StageProvider({ children }: { children: ReactNode }) {
	const [elementsArr, setElementsArr] = useState<ReactNode[]>([]);
	const addElementToStage = (element: ReactNode) =>
		setElementsArr((p) => [...p, element]);

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
					{children}
				</context.Provider>
			</Layer>
		</Stage>
	);
}

export const useStage = () => useContext(context);
