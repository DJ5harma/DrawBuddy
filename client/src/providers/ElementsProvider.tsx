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
	addElementToStage: (element: JSX.Element | null) => void;
}>({
	elementsArr: [],
	setElementsArr: () => {},
	addElementToStage: () => {},
});

export default function ElementsProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [elementsArr, setElementsArr] = useState<JSX.Element[]>([]);
	const addElementToStage = (element: JSX.Element | null) => {
		if (!element) return;
		const newArr = [...elementsArr, element];
		setElementsArr(newArr);

		localStorage.setItem(
			"serializedShapes",
			JSON.stringify(newArr.map((element) => serializeKonvaElement(element)))
		);
	};
	useEffect(() => {
		const serializedShapes = JSON.parse(
			localStorage.getItem("serializedShapes") || "[]"
		) as string[];
		setElementsArr(
			serializedShapes.map((serial) => deserializeKonvaElement(serial))
		);
	}, []);
	return (
		<context.Provider
			value={{ elementsArr, setElementsArr, addElementToStage }}
		>
			{children}
		</context.Provider>
	);
}

export const useElements = () => useContext(context);
