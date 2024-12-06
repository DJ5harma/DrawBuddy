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
import { IElement } from "../utils/types";
import { OFFLINE_SHAPES_KEY } from "../utils/constants";
import { useTools } from "./ToolsProvider";

const context = createContext<{
	elementsArrRef: MutableRefObject<IElement[]>;
	latestDeletedKeyRef: MutableRefObject<string | null>;
	flickerForLocalCreation: boolean;
	projectId: string;
	addElementToStage: (element: IElement) => void;
	removeElementFromStage: (key: string, force?: boolean) => void;
	setMainElements: (elements: IElement[]) => void;
	updateProject: (newId: string) => void;
}>({
	elementsArrRef: { current: [] },
	latestDeletedKeyRef: { current: null },
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

	const elementsArrRef = useRef<IElement[]>(
		(() => {
			if (projectId !== OFFLINE_SHAPES_KEY) return [];
			return JSON.parse(localStorage.getItem(projectId) || "[]") as IElement[];
		})()
	);

	const latestDeletedKeyRef = useRef<string | null>(null);

	const [flickerForLocalCreation, setFlickerForLocalCreation] = useState(false);

	const addElementToStage = (element: IElement) => {
		if (!element) return;
		elementsArrRef.current.push(element);
		setFlickerForLocalCreation((p) => !p);
	};
	const removeElementFromStage = (key: string, force?: boolean) => {
		if (!force && (!key || selectedToolRef.current.name !== "Eraser")) return;

		latestDeletedKeyRef.current = key;

		elementsArrRef.current = elementsArrRef.current.filter(
			({ shape }) => shape.key !== key
		);
		setFlickerForLocalCreation((p) => !p);
	};
	const setMainElements = (elements: IElement[]) => {
		elementsArrRef.current = elements || [];
		setFlickerForLocalCreation((p) => !p);
	};
	const updateProject = async (newId: string) => {
		toast.loading("Making room ready for you...");
		const { data } = await axios.post(RETRIVE_ROOM_ELEMENTS_API, {
			roomId: newId,
		});
		const elements = data.elements as IElement[];
		setMainElements(elements);
		toast.dismiss();
		toast.success("Room is ready");
		setProjectId(newId);
	};

	useEffect(() => {
		if (projectId === OFFLINE_SHAPES_KEY) {
			localStorage.setItem(
				OFFLINE_SHAPES_KEY,
				JSON.stringify(elementsArrRef.current)
			);
		}
	}, [elementsArrRef.current.length]);

	return (
		<context.Provider
			value={{
				elementsArrRef,
				addElementToStage,
				removeElementFromStage,
				setMainElements,
				flickerForLocalCreation,
				updateProject,
				projectId,
				latestDeletedKeyRef,
			}}
		>
			{children}
		</context.Provider>
	);
}

export const useElements = () => useContext(context);
