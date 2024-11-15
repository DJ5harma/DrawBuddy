import { useEffect } from "react";
import { useElements } from "../../providers/ElementsProvider";

export default function UndoHandler() {
	// const { elementsArr, setElementsArr } = useElements();

	// useEffect(() => {
	// 	const handleKeyDown = (e: KeyboardEvent) => {
	// 		console.log(e.key, e.metaKey, e.ctrlKey);
	// 		if ((e.ctrlKey || e.metaKey) && e.key === "z") {
	// 			setElementsArr([...elementsArr.slice(0, -1)]);
	// 		}
	// 	};
	// 	document.addEventListener("keydown", handleKeyDown);
	// 	return () => {
	// 		document.removeEventListener("keydown", handleKeyDown);
	// 	};
	// }, []);
	return null;
}
