import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { serializeKonvaElement } from "../utils/konva/convertKonva";

const context = createContext<{
	elementsArr: JSX.Element[];
	setElementsArr: Dispatch<SetStateAction<JSX.Element[]>>;
	addElementToStage: () => void;
	myNewElement: JSX.Element | null;
	setMyNewElement: Dispatch<SetStateAction<JSX.Element | null>>;
	flickerForLocalCreation: boolean;
}>({
	elementsArr: [],
	setElementsArr: () => {},
	addElementToStage: () => {},
	myNewElement: null,
	setMyNewElement: () => {},
	flickerForLocalCreation: false,
});

export default function ElementsProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [elementsArr, setElementsArr] = useState<JSX.Element[]>(() => {
		return JSON.parse(localStorage.getItem("serializedShapes") || "[]");
	});
	const [flickerForLocalCreation, setFlickerForLocalCreation] = useState(false);
	const [myNewElement, setMyNewElement] = useState<JSX.Element | null>(null);
	const addElementToStage = () => {
		if (!myNewElement) return;
		setElementsArr([...elementsArr, serializeKonvaElement(myNewElement)]);
		setMyNewElement(null);
		setFlickerForLocalCreation((p) => !p);
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
				flickerForLocalCreation,
			}}
		>
			{children}
		</context.Provider>
	);
}

export const useElements = () => useContext(context);
