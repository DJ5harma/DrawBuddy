import { Freehand } from "./Freehand/Freehand";
import { Rectangle } from "./Rectangle/Rectangle";

let drawer_index = 0;
const drawers = [Rectangle, Freehand];

export default function init(canvas: HTMLCanvasElement) {
	canvas.style.position = "fixed";
	canvas.style.left = "0px";
	canvas.style.top = "0px";
	canvas.style.border = "solid red";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});

	document.addEventListener("mousedown", (e) => {
		drawers[drawer_index].mousedown(e);
	});
	document.addEventListener("mousemove", (e) => {
		drawers[drawer_index].mousemove(e);
	});
	document.addEventListener("mouseup", (e) => {
		drawers[drawer_index].mouseup(e);
	});
}
