import { canvas, ctx } from "../../main";
import { Shape } from "../Shape/Shape";

export default class CanvasManager {
	private static arr: Shape[] = [];

	private static undo_stack: Shape[] = [];

	static init() {
		console.log("CanvasManager init");

		document.addEventListener("keydown", (e) => {
			if (e.ctrlKey && e.key.toUpperCase() === "Z") this.undo();
			if (e.ctrlKey && e.key.toUpperCase() === "Y") this.redo();
		});
	}

	static undo() {
		const last_shape = this.arr.pop();
		if (!last_shape) return;

		this.undo_stack.push(last_shape);

		this.clear_canvas_only_unrender().render_stored_shapes();
	}

	static redo() {
		const last_undid_shape = this.undo_stack.pop();

		if (!last_undid_shape) return;

		this.store_shape(last_undid_shape).render_shape(last_undid_shape);
	}

	static store_shape(Shape: Shape) {
		this.arr.push(Shape.getCopy());
		// console.log(this.arr);

		return this;
	}

	static render_shape(Shape: Shape) {
		Shape.render_me_whole();
		return this;
	}

	static render_stored_shapes() {
		this.arr.forEach((Shape) => this.render_shape(Shape));
		return this;
	}

	static unstore_shape(key: number) {
		this.arr = this.arr.filter((_, i) => i != key);
		return this;
	}

	static clear_canvas_only_unrender() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		return this;
	}
	static clear_canvas_fully() {
		this.clear_canvas_only_unrender();
		this.arr = [];
		this.undo_stack = [];
		return this;
	}

	static get_shapes_inside_rect(
		x1: number,
		y1: number,
		x2: number,
		y2: number
	) {
		return [];
	}
}
