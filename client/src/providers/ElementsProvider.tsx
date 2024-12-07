import {
	createContext,
	Dispatch,
	MutableRefObject,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import axios from "axios";
import { RETRIVE_ROOM_ELEMENTS_API } from "../utils/apiRoutes";
import toast from "react-hot-toast";
import { IElement, IElementsMap } from "../utils/types";
import { OFFLINE_SHAPES_KEY } from "../utils/constants";
import { useTools } from "./ToolsProvider";
import { useSocket } from "./SocketProvider";

const context = createContext<{
	elementsRef: MutableRefObject<IElementsMap>;
	latestAddedElementRef: MutableRefObject<IElement | null>;
	flickerForLocalCreation: boolean;
	addElementToStage: (element: IElement, fromPeer: boolean) => void;
	removeElementFromStage: (key: string, fromPeer: boolean) => void;
	setMainElements: (elements: [string, IElement][]) => void;
	roomId: string;
	setRoomId: Dispatch<SetStateAction<string>>;
}>({
	elementsRef: { current: new Map() },
	latestAddedElementRef: { current: null },
	flickerForLocalCreation: false,
	addElementToStage: () => {},
	removeElementFromStage: () => {},
	setMainElements: () => {},
	roomId: OFFLINE_SHAPES_KEY,
	setRoomId: () => {},
});

export default function ElementsProvider({
	children,
}: {
	children: ReactNode;
}) {
	const { socket } = useSocket();

	const { selectedToolRef } = useTools();

	const [roomId, setRoomId] = useState(OFFLINE_SHAPES_KEY);

	const elementsRef = useRef(new Map<string, IElement>());

	const latestAddedElementRef = useRef<IElement | null>(null);

	const [flickerForLocalCreation, setFlickerForLocalCreation] = useState(false);

	const addElementToStage = (element: IElement, fromPeer: boolean) => {
		if (!element || !element.shape.key) return;

		elementsRef.current.set(element.shape.key, element);

		if (!fromPeer)
			socket.emit("finalized_new_element", {
				element,
				roomId,
			});

		setFlickerForLocalCreation((p) => !p);
	};

	const removeElementFromStage = (key: string, fromPeer: boolean) => {
		if (!key || (!fromPeer && selectedToolRef.current.name !== "Eraser"))
			return;

		if (!fromPeer)
			socket.emit("removed_element", {
				key,
				roomId,
			});

		elementsRef.current.delete(key);

		setFlickerForLocalCreation((p) => !p);
	};

	const setMainElements = (elements: [string, IElement][]) => {
		const mp = new Map<string, IElement>();

		elements.forEach((val) => {
			mp.set(val[0], val[1]);
		});

		elementsRef.current = mp;

		setFlickerForLocalCreation((p) => !p);
	};

	useEffect(() => {
		if (roomId !== OFFLINE_SHAPES_KEY) {
			toast.loading("Making room ready for you...");
			axios
				.post(RETRIVE_ROOM_ELEMENTS_API, {
					roomId,
				})
				.then(({ data }) => {
					setMainElements(data.elements);
					toast.dismiss();
					toast.success("Room is ready");
				});
		}
	}, [roomId]);

	useEffect(() => {
		if (roomId === OFFLINE_SHAPES_KEY)
			setMainElements(
				JSON.parse(localStorage.getItem(roomId) || "[]") as [string, IElement][]
			);
	}, []);

	useEffect(() => {
		if (roomId === OFFLINE_SHAPES_KEY)
			localStorage.setItem(
				OFFLINE_SHAPES_KEY,
				JSON.stringify([...elementsRef.current.entries()])
			);
	}, [elementsRef.current.size]);

	return (
		<context.Provider
			value={{
				elementsRef,
				addElementToStage,
				removeElementFromStage,
				setMainElements,
				flickerForLocalCreation,
				latestAddedElementRef,
				roomId,
				setRoomId,
			}}
		>
			{children}
		</context.Provider>
	);
}

export const useElements = () => useContext(context);
