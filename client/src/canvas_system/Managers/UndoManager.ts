import CanvasManager from "./CanvasManager";
import { Shape } from "../Shapes/Shape";

export default class UndoManager {
	private static undo_stack: Shape[] = [];

	static init() {
		console.log("UndoManager init");

		document.addEventListener("keydown", (e) => {
			if (e.ctrlKey && e.key.toUpperCase() === "Z") this.undo();
			if (e.ctrlKey && e.key.toUpperCase() === "Y") this.redo();
		});
	}

	static undo() {
		const last_shape = CanvasManager.pop_shape();
		if (!last_shape) return;

		this.undo_stack.push(last_shape);

		CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
	}

	static redo() {
		const last_undid_shape = this.undo_stack.pop();

		if (!last_undid_shape) return;

		CanvasManager.store_shape(last_undid_shape).render_shape(last_undid_shape);
	}
}
