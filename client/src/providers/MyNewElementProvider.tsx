import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from "react";
import { useTools } from "./ToolsProvider";
import { useStage } from "./StageProvider";
import { useElements } from "./ElementsProvider";

const context = createContext<{
	myNewElement: JSX.Element | null;
	setMyNewElement: Dispatch<SetStateAction<JSX.Element | null>>;
	handleCreatedElement: () => void;
}>({
	myNewElement: null,
	setMyNewElement: () => {},
	handleCreatedElement: () => {},
});

export default function MyNewElementProvider({
	children,
}: {
	children?: ReactNode;
}) {
	const [myNewElement, setMyNewElement] = useState<JSX.Element | null>(null);

	const { addElementToStage } = useElements();

	const { stagePos, stageScale } = useStage();

	const { selectedTool } = useTools();

	const handleCreatedElement = () => {
		if (!myNewElement) return;
		addElementToStage({ shape: myNewElement, stagePos, stageScale });
		setMyNewElement(null);
	};

	return (
		<context.Provider
			value={{
				myNewElement,
				setMyNewElement,
				handleCreatedElement,
			}}
		>
			{selectedTool.handler}
			{children}
			{myNewElement}
		</context.Provider>
	);
}

export const useMyNewElement = () => useContext(context);
