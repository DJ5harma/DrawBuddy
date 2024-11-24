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
import { IPeers } from "../utils/types";

const context = createContext<{
	elementsArr: JSX.Element[];
	setElementsArr: Dispatch<SetStateAction<JSX.Element[]>>;
	addElementToStage: () => void;
	myNewElement: JSX.Element | null;
	setMyNewElement: Dispatch<SetStateAction<JSX.Element | null>>;
	flickerForLocalCreation: boolean;
	peers: IPeers;
	setPeers: Dispatch<SetStateAction<IPeers>>;
}>({
	elementsArr: [],
	setElementsArr: () => {},
	addElementToStage: () => {},
	myNewElement: null,
	setMyNewElement: () => {},
	flickerForLocalCreation: false,
	peers: {},
	setPeers: () => {},
});

export default function ElementsProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [elementsArr, setElementsArr] = useState<JSX.Element[]>(() => {
		return (
			JSON.parse(
				localStorage.getItem("serializedShapes") || "[]"
			) as JSX.Element[]
		).map((elem) => deserializeKonvaElement(elem));
	});
	const [flickerForLocalCreation, setFlickerForLocalCreation] = useState(false);

	const [myNewElement, setMyNewElement] = useState<JSX.Element | null>(null);

	const addElementToStage = () => {
		if (!myNewElement) return;
		setElementsArr([...elementsArr, myNewElement]);
		setMyNewElement(null);
		setFlickerForLocalCreation((p) => !p);
	};

	const [peers, setPeers] = useState<IPeers>({});

	useEffect(() => {
		localStorage.setItem(
			"serializedShapes",
			JSON.stringify(elementsArr.map((elem) => serializeKonvaElement(elem)))
		);
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
				peers,
				setPeers,
			}}
		>
			{children}
		</context.Provider>
	);
}

export const useElements = () => useContext(context);
