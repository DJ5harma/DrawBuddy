import {
	createContext,
	MutableRefObject,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	deserializeKonvaElement,
	serializeKonvaElement,
} from "../utils/konva/convertKonva";

const context = createContext<{
	elementsArrRef: MutableRefObject<JSX.Element[]>;
	addElementToStage: (element: JSX.Element | null) => void;
	setMainElements: (element: JSX.Element[]) => void;
	flickerForLocalCreation: boolean;
}>({
	elementsArrRef: { current: [] },
	addElementToStage: () => {},
	setMainElements: () => {},
	flickerForLocalCreation: false,
});

export default function ElementsProvider({
	children,
}: {
	children: ReactNode;
}) {
	const elementsArrRef = useRef<JSX.Element[]>(
		(() => {
			return (
				JSON.parse(
					localStorage.getItem("serializedShapes") || "[]"
				) as JSX.Element[]
			).map((elem) => deserializeKonvaElement(elem));
		})()
	);
	const [flickerForLocalCreation, setFlickerForLocalCreation] = useState(false);

	const addElementToStage = (element: JSX.Element | null) => {
		if (!element) return;
		elementsArrRef.current.push(element);
		setFlickerForLocalCreation((p) => !p);
	};
	const setMainElements = (elements: JSX.Element[]) => {
		elementsArrRef.current = elements || [];
		setFlickerForLocalCreation((p) => !p);
	};

	useEffect(() => {
		localStorage.setItem(
			"serializedShapes",
			JSON.stringify(
				elementsArrRef.current.map((elem) => serializeKonvaElement(elem))
			)
		);
	}, [flickerForLocalCreation]);

	return (
		<context.Provider
			value={{
				elementsArrRef,
				addElementToStage,
				setMainElements,
				flickerForLocalCreation,
			}}
		>
			{children}
		</context.Provider>
	);
}

export const useElements = () => useContext(context);
