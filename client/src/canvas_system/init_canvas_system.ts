import { canvas } from "../main";
import ShapeMakerManager from "./ShapeMakerManager/ShapeMakerManager";
import CanvasManager from "./CanvasManager/CanvasManager";

export default function init_canvas_system() {
	canvas.style.position = "fixed";
	canvas.style.left = "0px";
	canvas.style.top = "0px";
	canvas.style.border = "solid red";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	ShapeMakerManager.init();
	CanvasManager.init();

	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});
}
