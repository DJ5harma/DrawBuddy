import { Layer, Stage } from "react-konva";
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
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

	return (
		<Stage
			width={window.innerWidth}
			height={window.innerHeight}
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
