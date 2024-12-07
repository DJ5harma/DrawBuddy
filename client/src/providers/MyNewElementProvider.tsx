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
import { useStage } from "./StageProvider";
import { useElements } from "./ElementsProvider";
import { serializeKonvaElement } from "../utils/konva/convertKonva";
import { useSocket } from "./SocketProvider";

const context = createContext<{
	myNewElement: JSX.Element | null;
	setMyNewElement: Dispatch<SetStateAction<JSX.Element | null>>;
	handleCreatedElement: () => void;
}>({
	myNewElement: null,
	setMyNewElement: () => {},
	handleCreatedElement: () => {},
});

export default function MyNewElementProvider({
	children,
}: {
	children?: ReactNode;
}) {
	const { socket } = useSocket();

	const { selectedToolRef } = useTools();

	const { addElementToStage, roomId } = useElements();

	const { stagePos, stageScale } = useStage();

	const [myNewElement, setMyNewElement] = useState<JSX.Element | null>(null);

	const handleCreatedElement = () => {
		if (!myNewElement) return;

		addElementToStage(
			{
				shape: serializeKonvaElement(myNewElement),
				stagePos,
				stageScale,
			},
			false
		);

		setMyNewElement(null);
	};

	useEffect(() => {
		socket.emit("creating_new_element", {
			element: myNewElement
				? serializeKonvaElement(myNewElement)
				: myNewElement,
			roomId,
		});
	}, [myNewElement]);

	return (
		<context.Provider
			value={{
				myNewElement,
				setMyNewElement,
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
