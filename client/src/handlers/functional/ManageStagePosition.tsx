import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useElements } from "../../providers/ElementsProvider";
import { IPoint } from "../../utils/types";

export default function ManageStagePos({
	stagePos,
	setStagePos,
	setStageScale,
}: {
	stagePos: IPoint;
	setStagePos: Dispatch<SetStateAction<IPoint>>;
	setStageScale: Dispatch<SetStateAction<number>>;
}) {
	const { elementsRef } = useElements();

	const [inputPos, setInputPos] = useState({ x: 0, y: 0 });

	// const [len, setLen] = useState(0);

	// const [curr, setCurr] = useState(-1);

	useEffect(() => {
		setInputPos(stagePos);
	}, [stagePos]);

	// useEffect(() => {
	// 	const newLen = Object.keys(elementsRef.current).length;
	// 	setLen(newLen);
	// }, [elementsRef.current.length]);

	// useEffect(() => {
	// 	if (len <= 1) setCurr(-1);
	// }, [len]);

	// useEffect(() => {
	// 	const len = Object.keys(elementsRef.current).length;
	// 	if (curr > -1 && curr < len) {
	// 		const elem = elementsRef.current.get(curr);
	// 		setStagePos(.stagePos);
	// 		setStageScale(elementsRef.current[curr].stageScale);
	// 	}
	// }, [curr]);

	// const handleBack = () => {
	// 	try {
	// 		let x = curr;
	// 		const thisPos = elementsRef.current[x].stagePos;
	// 		while (x >= 1) {
	// 			const prevPos = elementsRef.current[x - 1].stagePos;
	// 			if (thisPos.x !== prevPos.x || thisPos.y !== prevPos.y) {
	// 				setCurr(x - 1);
	// 				return;
	// 			}
	// 			x--;
	// 		}
	// 		setCurr(curr - 1);
	// 	} catch (error) {}
	// };

	// const handleLast = () => {
	// 	try {
	// 		setStagePos(elementsRef.current[len - 1].stagePos);
	// 		setStageScale(elementsRef.current[len - 1].stageScale);
	// 		setCurr(len - 1);
	// 	} catch (error) {}
	// };

	return (
		<div
			className="absolute bottom-4 w-full items-center flex flex-col gap-4 select-none"
			onMouseDown={(e) => e.stopPropagation()}
		>
			{/* {len ? (
				<div className="[&>button]:bg-blue-700 [&>button]:p-2 flex gap-2 [&>button]:font-semibold items-center">
					<p>Teleport: </p>
					{curr >= 1 && <button onClick={handleBack}>Back</button>}
					<button onClick={handleLast}>Last</button>
				</div>
			) : null} */}
			<div className="[&>input]:text-black [&>input]:px-1 [&>input]:w-16 [&>input]:text-center flex gap-2 font-semibold">
				<p className="font-normal">Change: </p>

				<p>x</p>

				<input
					value={inputPos.x.toFixed()}
					onChange={(e) => {
						const val = parseInt(e.target.value);
						setStagePos((p) => ({
							...p,
							x: Number.isNaN(val) ? 0 : val,
						}));
					}}
				/>

				<p>y</p>

				<input
					value={inputPos.y.toFixed()}
					onChange={(e) => {
						const val = parseInt(e.target.value);
						setStagePos((p) => ({
							...p,
							y: Number.isNaN(val) ? 0 : val,
						}));
					}}
				/>
			</div>
		</div>
	);
}
