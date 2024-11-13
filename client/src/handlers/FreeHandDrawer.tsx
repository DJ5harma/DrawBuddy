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

		// console.log(canvasRef.current?.toDataURL());
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!drawing || !canvasRef.current || !ctx) return;

		const { offsetX: x, offsetY: y } = e;
		ctx.lineTo(x, y);
		ctx.stroke();
	};

	const handleMouseUp = () => setDrawing(false);

	const [wentOutWhileDrawing, setWentOutWhileDrawing] = useState(false);
	const handleMouseOut = () => {
		handleMouseUp();
		setWentOutWhileDrawing(true);
	};
	const handlemouseEnter = (e: MouseEvent) => {
		console.log("in");

		if (!wentOutWhileDrawing) return;
		setWentOutWhileDrawing(false);
		handleMouseDown(e);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !ctx) return;

		ctx.lineCap = "round";
		ctx.strokeStyle = "white";
		ctx.lineWidth = 5;

		canvas.addEventListener("mousedown", handleMouseDown);
		canvas.addEventListener("mousemove", handleMouseMove);
		canvas.addEventListener("mouseup", handleMouseUp);
		canvas.addEventListener("mouseout", handleMouseOut);
		canvas.addEventListener("mouseenter", handlemouseEnter);

		return () => {
			canvas.removeEventListener("mousedown", handleMouseDown);
			canvas.removeEventListener("mousemove", handleMouseMove);
			canvas.removeEventListener("mouseup", handleMouseUp);
			canvas.removeEventListener("mouseout", handleMouseOut);
			canvas.removeEventListener("mouseenter", handlemouseEnter);
		};
	}, [canvasRef, ctx, drawing]);

	return null;
};

export default FreeHandDrawer;
