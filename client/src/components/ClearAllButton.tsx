import { MdOutlineDelete } from "react-icons/md";
import { useElements } from "../providers/ElementsProvider";
import { useSocket } from "../providers/SocketProvider";
import { useMyNewElement } from "../providers/MyNewElementProvider";
import PopUpWrapper from "./PopUpWrapper";
import { useState } from "react";

export default function ClearAllButton() {
	const { setMainElements, roomId } = useElements();

	const { setMyNewElement } = useMyNewElement();

	const { socket } = useSocket();

	const [showConfirmation, setShowConfirmation] = useState(false);

	return (
		<>
			<button
				onClick={() => setShowConfirmation((p) => !p)}
				onMouseDown={(e) => e.stopPropagation()}
				className="absolute p-2 bottom-4 right-4 z-10 hover:bg-neutral-700 bg-neutral-800"
			>
				<MdOutlineDelete size={25} />
			</button>

			{showConfirmation && (
				<PopUpWrapper setShow={setShowConfirmation}>
					<p>Do you really want to clear the canvas?</p>
					<p className="bg-red-300 text-red-900 p-2">
						WARNING: This action is irreversible
					</p>
					<div className="flex w-full justify-around text-xl [&>button]:px-4 [&>button]:py-2 [&>button]:flex-1 gap-2">
						<button
							onClick={() => setShowConfirmation(false)}
							className="bg-white"
						>
							No
						</button>
						<button
							onClick={() => {
								setMainElements([]);
								setMyNewElement(null);
								socket.emit("clear_all_elements", { roomId });
								setShowConfirmation(false);
							}}
							className="bg-red-700 text-white"
						>
							Yes
						</button>
					</div>
				</PopUpWrapper>
			)}
		</>
	);
}
