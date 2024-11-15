import { MdOutlineDelete } from "react-icons/md";
import { useStage } from "../providers/StageProvider";

export default function ClearAllHandler() {
	const { setElementsArr } = useStage();
	return (
		<div
			className="absolute top-4 right-4 z-10 cursor-pointer"
			onClick={() => {
				setElementsArr([]);
				localStorage.clear();
			}}
		>
			<MdOutlineDelete size={30} />
		</div>
	);
}
