import { useEffect, useState } from "react";
import { useStage } from "../../providers/StageProvider";

export default function StagePositionModRAW() {
	const { stagePos, setStagePos } = useStage();

	const [inputPos, setInputPos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		setInputPos(stagePos);
	}, [stagePos]);

	return (
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
	);
}
