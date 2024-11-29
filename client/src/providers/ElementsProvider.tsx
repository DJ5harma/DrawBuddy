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
import axios from "axios";
import { RETRIVE_ROOM_ELEMENTS_API } from "../utils/apiRoutes";
import toast from "react-hot-toast";
import { IElement } from "../utils/types";

const OFFLINE_SHAPES = "OFFLINE_SHAPES";

const context = createContext<{
	elementsArrRef: MutableRefObject<IElement[]>;
	addElementToStage: (element: IElement) => void;
	setMainElements: (elements: IElement[]) => void;
	flickerForLocalCreation: boolean;
	updateProject: (newId: string) => void;
	projectId: string;
}>({
	elementsArrRef: { current: [] },
	addElementToStage: () => {},
	setMainElements: () => {},
	flickerForLocalCreation: false,
	updateProject: () => {},
	projectId: OFFLINE_SHAPES,
});

export default function ElementsProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [projectId, setProjectId] = useState(OFFLINE_SHAPES);
	const elementsArrRef = useRef<IElement[]>(
		(() => {
			if (projectId !== OFFLINE_SHAPES) return [];
			return (
				JSON.parse(localStorage.getItem(projectId) || "[]") as IElement[]
			).map(({ shape, stagePos, stageScale }) => ({
				shape: deserializeKonvaElement(shape),
				stagePos,
				stageScale,
			}));
		})()
	);

	const [flickerForLocalCreation, setFlickerForLocalCreation] = useState(false);

	const addElementToStage = (element: IElement) => {
		if (!element) return;
		elementsArrRef.current.push(element);
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
		setMainElements(
			elements.map(({ shape, stagePos, stageScale }) => ({
				shape: deserializeKonvaElement(shape),
				stagePos,
				stageScale,
			}))
		);
		toast.dismiss();
		toast.success("Room is ready");
		setProjectId(newId);
	};

	useEffect(() => {
		if (projectId === OFFLINE_SHAPES) {
			localStorage.setItem(
				OFFLINE_SHAPES,
				JSON.stringify(
					elementsArrRef.current.map(({ shape, stagePos }) => ({
						shape: serializeKonvaElement(shape),
						stagePos,
					}))
				)
			);
		}
	}, [elementsArrRef.current.length]);

	return (
		<context.Provider
			value={{
				elementsArrRef,
				addElementToStage,
				setMainElements,
				flickerForLocalCreation,
				updateProject,
				projectId,
			}}
		>
			{children}
		</context.Provider>
	);
}

export const useElements = () => useContext(context);
