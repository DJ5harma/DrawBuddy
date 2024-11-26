import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from "react";

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
	children: ReactNode;
}) {
	const [myNewElement, setMyNewElement] = useState<
		JSX.Element | null | undefined
	>(undefined);
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
