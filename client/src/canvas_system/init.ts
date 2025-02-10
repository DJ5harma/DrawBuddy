import { canvas } from "../main";
import ShapeMakerManager from "./ShapeMakerManager";

export default function init() {
	canvas.style.position = "fixed";
	canvas.style.left = "0px";
	canvas.style.top = "0px";
	canvas.style.border = "solid red";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const shapeMakerManager = new ShapeMakerManager();

	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});
}
