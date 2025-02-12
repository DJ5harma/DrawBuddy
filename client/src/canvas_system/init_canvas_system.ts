import { canvases } from "../main";
import { MakerManager } from "./Managers/MakerManager";
import { CanvasManager } from "./Managers/CanvasManager/CanvasManager";
import { UndoManager } from "./Managers/UndoManager";

function design_canvas() {
	document.body.style.overflow = "hidden";
	canvases.forEach((canvas) => {
		const { style } = canvas;

		style.position = "absolute";
		style.left = "0px";
		style.top = "0px";
		style.border = "solid red";

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});
}

export default function init_canvas_system() {
	design_canvas();

	MakerManager.init();
	CanvasManager.init();
	UndoManager.init();
	let mutex_unlocked = true;

	window.addEventListener("resize", () => {
		canvases.forEach((cvs) => {
			cvs.width = window.innerWidth;
			cvs.height = window.innerHeight;
		});

		if (mutex_unlocked) {
			mutex_unlocked = false;
			setTimeout(() => {
				CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
				mutex_unlocked = true;
			}, 100);
		}
	});
}
