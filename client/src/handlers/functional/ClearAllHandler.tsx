import { MdOutlineDelete } from "react-icons/md";
import { useElements } from "../../providers/ElementsProvider";

export default function ClearAllHandler() {
	const { setElementsArr } = useElements();
	return (
		<button
			onClick={() => {
				setElementsArr([]);
				localStorage.removeItem("serializedShapes");
			}}
		>
			<MdOutlineDelete />
		</button>
	);
}
