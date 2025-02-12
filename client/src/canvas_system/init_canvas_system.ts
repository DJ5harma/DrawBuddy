import { canvas, temp_canvas } from "../main";
import { MakerManager } from "./Managers/MakerManager";
import { CanvasManager } from "./Managers/CanvasManager/CanvasManager";
import { UndoManager } from "./Managers/UndoManager";

function design_canvas() {
	[canvas, temp_canvas].forEach((canvas) => {
		const { style } = canvas;

		style.position = "fixed";
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
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		if (mutex_unlocked) {
			mutex_unlocked = false;
			setTimeout(() => {
				CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
				mutex_unlocked = true;
			}, 500);
		}
	});
}
