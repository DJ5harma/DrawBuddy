import { useEffect, useState } from "react";
import { useCanvas } from "../provider/CanvasProvider";

const FreeHandDrawer = () => {
	const { canvasRef, ctx } = useCanvas();
	const [drawing, setDrawing] = useState(false);

	const onMouseDown = (e: MouseEvent) => {
		if (!ctx) return;

		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
		setDrawing(true);

		// console.log(canvasRef.current?.toDataURL());
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!drawing || !canvasRef.current || !ctx) return;

		const { offsetX: x, offsetY: y } = e;
		ctx.lineTo(x, y);
		ctx.stroke();
	};

	const onMouseUp = () => setDrawing(false);
	const onMouseOut = () => setDrawing(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !ctx) return;

		ctx.lineCap = "round";
		ctx.strokeStyle = "white";
		ctx.lineWidth = 5;

		canvas.addEventListener("mousedown", onMouseDown);
		canvas.addEventListener("mousemove", onMouseMove);
		canvas.addEventListener("mouseup", onMouseUp);
		canvas.addEventListener("mouseout", onMouseOut);

		return () => {
			canvas.removeEventListener("mousedown", onMouseDown);
			canvas.removeEventListener("mousemove", onMouseMove);
			canvas.removeEventListener("mouseup", onMouseUp);
			canvas.removeEventListener("mouseout", onMouseOut);
		};
	}, [canvasRef, ctx, drawing]);

	return null;
};

export default FreeHandDrawer;
