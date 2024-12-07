import { useEffect, useRef, useState } from "react";
import { useElements } from "../../providers/ElementsProvider";
import { useStage } from "../../providers/StageProvider";
import { IPoint } from "../../utils/types";

export default function StageTeleporter() {
	const { elementsRef, latestAddedElementRef } = useElements();

	const { setStagePos, setStageScale } = useStage();

	const [len, setLen] = useState(0);

	const [curr, setCurr] = useState(-1);

	const prevLocsRef = useRef<{ stagePos: IPoint; stageScale: number }[]>([]);

	const filledLocsInitially = useRef(false);

	useEffect(() => {
		//One time
		if (!filledLocsInitially.current && elementsRef.current.size) {
			filledLocsInitially.current = true;
			elementsRef.current.forEach(({ stagePos, stageScale }) => {
				prevLocsRef.current.push({ stagePos, stageScale });
			});
		}
	}, [elementsRef.current.size]);

	useEffect(() => {
		if (latestAddedElementRef.current) {
			const { stagePos, stageScale } = latestAddedElementRef.current;
			prevLocsRef.current.push({ stagePos, stageScale });
		}
	}, [latestAddedElementRef.current]);

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
}
