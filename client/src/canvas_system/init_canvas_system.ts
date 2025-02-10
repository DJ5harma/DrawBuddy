import { canvas } from "../main";
import ShapeMakerManager from "./ShapeMakerManager/ShapeMakerManager";
import CanvasManager from "./CanvasManager/CanvasManager";

function design_canvas() {
	const { style } = canvas;

	style.position = "fixed";
	style.left = "0px";
	style.top = "0px";
	style.border = "solid red";

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

export default function init_canvas_system() {
	design_canvas();

	ShapeMakerManager.init();
	CanvasManager.init();

	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		CanvasManager.clear_canvas_only_unrender().render_stored_shapes();
	});
}
