import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { useTools } from "./ToolsProvider";

const context = createContext<{
	myNewElement: JSX.Element | null;
	setMyNewElement: Dispatch<SetStateAction<JSX.Element | null>>;
}>({
	myNewElement: null,
	setMyNewElement: () => {},
});

export default function MyNewElementProvider({
	children,
}: {
	children?: ReactNode;
}) {
	const [myNewElement, setMyNewElement] = useState<JSX.Element | null>(null);

	const { selectedTool } = useTools();

	return (
		<context.Provider
			value={{
				myNewElement,
				setMyNewElement,
			}}
		>
			{selectedTool.handler}
			{children}
			{myNewElement}
		</context.Provider>
	);
}

export const useMyNewElement = () => useContext(context);
