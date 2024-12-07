import {
	createContext,
	Dispatch,
	MutableRefObject,
	ReactNode,
	SetStateAction,
	useContext,
	useRef,
	useState,
} from "react";
import { useTools } from "./ToolsProvider";
import { useStage } from "./StageProvider";
import { useElements } from "./ElementsProvider";
import { serializeKonvaElement } from "../utils/konva/convertKonva";
import { IElement } from "../utils/types";

const context = createContext<{
	myNewElement: JSX.Element | null;
	setMyNewElement: Dispatch<SetStateAction<JSX.Element | null>>;
	preparedMyNewElementRef: MutableRefObject<IElement | null>;
	handleCreatedElement: () => void;
}>({
	myNewElement: null,
	preparedMyNewElementRef: { current: null },
	setMyNewElement: () => {},
	handleCreatedElement: () => {},
});

export default function MyNewElementProvider({
	children,
}: {
	children?: ReactNode;
}) {
	const { selectedToolRef } = useTools();

	const { addElementToStage } = useElements();

	const { stagePos, stageScale } = useStage();

	const [myNewElement, setMyNewElement] = useState<JSX.Element | null>(null);

	const preparedMyNewElementRef = useRef<IElement | null>(null);

	const handleCreatedElement = () => {
		if (!myNewElement) return;

		preparedMyNewElementRef.current = {
			shape: serializeKonvaElement(myNewElement),
			stagePos,
			stageScale,
		};

		addElementToStage(preparedMyNewElementRef.current);

		setMyNewElement(null);
	};

	return (
		<context.Provider
			value={{
				myNewElement,
				setMyNewElement,
				preparedMyNewElementRef,
				handleCreatedElement,
			}}
		>
			{selectedToolRef.current.handler}
			{children}
			{myNewElement}
		</context.Provider>
	);
}

export const useMyNewElement = () => useContext(context);
