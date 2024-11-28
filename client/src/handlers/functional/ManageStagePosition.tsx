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
		<div className="w-full absolute top-1 right-0 flex flex-col items-end gap-4 select-none">
			<div className="[&>input]:text-black [&>input]:px-1 [&>input]:w-16 [&>input]:text-center flex gap-2 font-semibold">
				<p className="font-normal">Change: </p>
				<p>x : </p>
				<input
					value={inputPos.x.toFixed()}
					onChange={(e) => {
						setStagePosition((p) => ({
							...p,
							x: parseInt(e.target.value || "0"),
						}));
					}}
				/>
				<p>y : </p>
				<input
					value={inputPos.y.toFixed()}
					onChange={(e) => {
						setStagePosition((p) => ({
							...p,
							y: parseInt(e.target.value || "0"),
						}));
					}}
				/>
			</div>
		</div>
	);
}
