import { useElements } from "../../providers/ElementsProvider";
import { useEffect } from "react";

export default function ClearAllHandler() {
	const { setElementsArr, setMyNewElement } = useElements();
	useEffect(() => {
		setElementsArr([]);
		setMyNewElement(null);
		localStorage.removeItem("serializedShapes");
	}, []);
	return null;
}
