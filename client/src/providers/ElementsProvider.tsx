import {
	createContext,
	MutableRefObject,
	ReactNode,
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

const context = createContext<{
	elementsRef: MutableRefObject<IElementsMap>;
	latestDeletedKeyRef: MutableRefObject<string | null>;
	latestAddedElementRef: MutableRefObject<IElement | null>;
	flickerForLocalCreation: boolean;
	projectId: string;
	addElementToStage: (element: IElement) => void;
	removeElementFromStage: (key: string, force?: boolean) => void;
	setMainElements: (elements: [string, IElement][]) => void;
	updateProject: (newId: string) => void;
}>({
	elementsRef: { current: new Map() },
	latestDeletedKeyRef: { current: null },
	latestAddedElementRef: { current: null },
	flickerForLocalCreation: false,
	projectId: OFFLINE_SHAPES_KEY,
	addElementToStage: () => {},
	removeElementFromStage: () => {},
	setMainElements: () => {},
	updateProject: () => {},
});

export default function ElementsProvider({
	children,
}: {
	children: ReactNode;
}) {
	const { selectedToolRef } = useTools();

	const [projectId, setProjectId] = useState(OFFLINE_SHAPES_KEY);

	const elementsRef = useRef(new Map<string, IElement>());

	const latestDeletedKeyRef = useRef<string | null>(null);
	const latestAddedElementRef = useRef<IElement | null>(null);

	const [flickerForLocalCreation, setFlickerForLocalCreation] = useState(false);

	const addElementToStage = (element: IElement) => {
		if (!element || !element.shape.key) return;

		elementsRef.current.set(element.shape.key, element);
		latestAddedElementRef.current = element;
		setFlickerForLocalCreation((p) => !p);
	};

	const removeElementFromStage = (key: string, peerRequest?: boolean) => {
		if (!peerRequest && (!key || selectedToolRef.current.name !== "Eraser"))
			return;

		if (!peerRequest) latestDeletedKeyRef.current = key;
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

	const updateProject = async (newId: string) => {
		toast.loading("Making room ready for you...");
		const { data } = await axios.post(RETRIVE_ROOM_ELEMENTS_API, {
			roomId: newId,
		});

		setMainElements(data.elements);

		toast.dismiss();
		toast.success("Room is ready");
		setProjectId(newId);
	};

	useEffect(() => {
		if (projectId === OFFLINE_SHAPES_KEY)
			setMainElements(
				JSON.parse(localStorage.getItem(projectId) || "[]") as [
					string,
					IElement
				][]
			);
	}, []);

	useEffect(() => {
		if (projectId === OFFLINE_SHAPES_KEY)
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
				updateProject,
				projectId,
				latestDeletedKeyRef,
				latestAddedElementRef,
			}}
		>
			{children}
		</context.Provider>
	);
}

export const useElements = () => useContext(context);
