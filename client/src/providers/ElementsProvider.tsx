import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	deserializeKonvaElement,
	serializeKonvaElement,
} from "../utils/konva/convertKonva";

const context = createContext<{
	elementsArr: JSX.Element[];
	setElementsArr: Dispatch<SetStateAction<JSX.Element[]>>;
	addElementToStage: () => void;
	myNewElement: JSX.Element | null;
	setMyNewElement: Dispatch<SetStateAction<JSX.Element | null>>;
}>({
	elementsArr: [],
	setElementsArr: () => {},
	addElementToStage: () => {},
	myNewElement: null,
	setMyNewElement: () => {},
});

export default function ElementsProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [elementsArr, setElementsArr] = useState<JSX.Element[]>(() => {
		return JSON.parse(localStorage.getItem("serializedShapes") || "[]");
	});
	const [myNewElement, setMyNewElement] = useState<JSX.Element | null>(null);
	const addElementToStage = () => {
		if (!myNewElement) return;
		setElementsArr([...elementsArr, serializeKonvaElement(myNewElement)]);
		setMyNewElement(null);
	};
	useEffect(() => {
		localStorage.setItem("serializedShapes", JSON.stringify(elementsArr));
	}, [elementsArr]);
	return (
		<context.Provider
			value={{
				elementsArr,
				setElementsArr,
				addElementToStage,
				myNewElement,
				setMyNewElement,
			}}
		>
			{children}
		</context.Provider>
	);
}

export const useElements = () => useContext(context);
