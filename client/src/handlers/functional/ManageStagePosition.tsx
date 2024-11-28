import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function ManageStagePosition({
	stagePosition,
	setStagePosition,
}: {
	stagePosition: { x: number; y: number };
	setStagePosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
}) {
	const [inputPos, setInputPos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		setInputPos(stagePosition);
	}, [stagePosition]);

	return (
		<div
			className="w-full absolute top-1 right-0 flex flex-col items-end gap-4 select-none z-50"
			onMouseDown={(e) => e.stopPropagation()}
		>
			<div className="[&>input]:text-black [&>input]:px-1 [&>input]:w-16 [&>input]:text-center flex gap-2 font-semibold">
				<p className="font-normal">Change: </p>
				<p>x : </p>
				<input
					value={inputPos.x.toFixed()}
					onChange={(e) => {
						const val = parseInt(e.target.value);
						setStagePosition((p) => ({
							...p,
							x: Number.isNaN(val) ? 0 : val,
						}));
					}}
				/>
				<p>y : </p>
				<input
					value={inputPos.y.toFixed()}
					onChange={(e) => {
						const val = parseInt(e.target.value);
						setStagePosition((p) => ({
							...p,
							y: Number.isNaN(val) ? 0 : val,
						}));
					}}
				/>
			</div>
		</div>
	);
}
