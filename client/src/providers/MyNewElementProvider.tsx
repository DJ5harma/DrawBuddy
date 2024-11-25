import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from "react";

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
	children: ReactNode;
}) {
	const [myNewElement, setMyNewElement] = useState<JSX.Element | null>(null);
	return (
		<context.Provider
			value={{
				myNewElement,
				setMyNewElement,
			}}
		>
			{children}
		</context.Provider>
	);
}

export const useMyNewElement = () => useContext(context);
