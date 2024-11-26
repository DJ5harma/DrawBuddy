import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from "react";
import { useTools } from "./ToolsProvider";

const context = createContext<{
	myNewElement: JSX.Element | null | undefined;
	setMyNewElement: Dispatch<SetStateAction<JSX.Element | null | undefined>>;
}>({
	myNewElement: undefined,
	setMyNewElement: () => {},
});

export default function MyNewElementProvider({
	children,
}: {
	children?: ReactNode;
}) {
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
			{selectedTool && selectedTool.handler}
			{children && children}
			{myNewElement}
		</context.Provider>
	);
}

export const useMyNewElement = () => useContext(context);
