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

const context = createContext<{
	myNewElement: JSX.Element | null | undefined;
	setMyNewElement: Dispatch<SetStateAction<JSX.Element | null | undefined>>;
}>({
	myNewElement: undefined,
	setMyNewElement: () => {},
});

export default function MyNewElementProvider() {
	const [myNewElement, setMyNewElement] = useState<
		JSX.Element | null | undefined
	>(undefined);

	const { selectedTool } = useTools();
	return (
		<context.Provider
			value={{
				myNewElement,
				setMyNewElement,
			}}
		>
			{myNewElement}
			{selectedTool && selectedTool.handler}
		</context.Provider>
	);
}

export const useMyNewElement = () => useContext(context);
