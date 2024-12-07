import { useEffect, useRef, useState } from "react";
import { useElements } from "../../providers/ElementsProvider";
import { IPoint } from "../../utils/types";
import { useStage } from "../../providers/StageProvider";

const DirectPosMod = () => {
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
};

const StageTeleporter = () => {
	const { elementsRef, latestAddedElementRef } = useElements();

	const { setStagePos, setStageScale } = useStage();

	const [len, setLen] = useState(0);

	const [curr, setCurr] = useState(-1);

	const prevLocsRef = useRef<{ stagePos: IPoint; stageScale: number }[]>([]);

	const filledLocsInitially = useRef(false);

	useEffect(() => {
		if (latestAddedElementRef.current) {
			const { stagePos, stageScale } = latestAddedElementRef.current;
			prevLocsRef.current.push({ stagePos, stageScale });
		}
	}, [latestAddedElementRef.current]);

	useEffect(() => {
		if (!filledLocsInitially.current && elementsRef.current.size) {
			filledLocsInitially.current = true;
			elementsRef.current.forEach(({ stagePos, stageScale }) => {
				prevLocsRef.current.push({ stagePos, stageScale });
			});
		}
	}, [elementsRef.current.size]);

	useEffect(() => {
		setLen(prevLocsRef.current.length);
	}, [prevLocsRef.current.length]);

	useEffect(() => {
		if (len <= 1) setCurr(-1);
	}, [len]);

	useEffect(() => {
		const len = prevLocsRef.current.length;
		if (curr > -1 && curr < len) {
			const obj = prevLocsRef.current[curr];
			setStagePos(obj.stagePos);
			setStageScale(obj.stageScale);
		}
	}, [curr]);

	const handleBack = () => {
		try {
			let x = curr;
			const thisPos = prevLocsRef.current[x].stagePos;
			while (x >= 1) {
				const prevPos = prevLocsRef.current[x - 1].stagePos;
				if (thisPos.x !== prevPos.x || thisPos.y !== prevPos.y) {
					setCurr(x - 1);
					return;
				}
				x--;
			}
			setCurr(curr - 1);
		} catch (error) {}
	};

	const handleLast = () => {
		try {
			const { stagePos, stageScale } = prevLocsRef.current[len - 1];
			setStagePos(stagePos);
			setStageScale(stageScale);
			setCurr(len - 1);
		} catch (error) {}
	};
	if (!len) return null;
	return (
		<div className="[&>button]:bg-blue-700 [&>button]:p-2 flex gap-2 [&>button]:font-semibold items-center">
			<p>Teleport: </p>
			{curr >= 1 && <button onClick={handleBack}>Back</button>}
			<button onClick={handleLast}>Last</button>
		</div>
	);
};

export default function ManageStagePos() {
	return (
		<div
			className="absolute bottom-4 w-full items-center flex flex-col gap-4 select-none"
			onMouseDown={(e) => e.stopPropagation()}
		>
			<StageTeleporter />
			<DirectPosMod />
		</div>
	);
}
