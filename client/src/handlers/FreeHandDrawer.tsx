import { useEffect, useState } from "react";
import { useCanvas } from "../provider/CanvasProvider";

const FreeHandDrawer = () => {
	const { canvasRef, ctx } = useCanvas();
	const [drawing, setDrawing] = useState(false);

	const handleMouseDown = (e: MouseEvent) => {
		if (!ctx) return;

		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
		setDrawing(true);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!drawing || !canvasRef.current || !ctx) return;

		const { offsetX: x, offsetY: y } = e;
		ctx.lineTo(x, y);
		ctx.stroke();
	};

	const handleMouseUp = () => setDrawing(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !ctx) return;

		ctx.lineCap = "round";
		ctx.strokeStyle = "white";
		ctx.lineWidth = 10;

		canvas.addEventListener("mousedown", handleMouseDown);
		canvas.addEventListener("mousemove", handleMouseMove);
		canvas.addEventListener("mouseup", handleMouseUp);

		return () => {
			canvas.removeEventListener("mousedown", handleMouseDown);
			canvas.removeEventListener("mousemove", handleMouseMove);
			canvas.removeEventListener("mouseup", handleMouseUp);
		};
	}, [canvasRef, ctx, drawing]);

	return null;
};

export default FreeHandDrawer;
