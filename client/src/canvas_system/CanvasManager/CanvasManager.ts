import { canvas, ctx } from "../../main";
import { Shape } from "../Shape/Shape";

export default class CanvasManager {
	private static arr: Shape[] = [];

	static init() {
		console.log("CanvasManager init");

		document.addEventListener("keydown", (e) => {
			if (e.ctrlKey && this.arr.length) this.undo();
		});
	}

	static undo() {
		this.arr.pop();
		console.log(this.arr);
		console.log("deleted index", this.arr.length);
		console.log(this.arr);

		CanvasManager.clear_canvas();

		this.arr.forEach((shape) => {
			shape.render_me_whole();
		});
	}

	static store_shape(Shape: Shape) {
		this.arr.push(Shape);
		console.log(this.arr);

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
	static unrender_shape(shape: Shape) {
		return this;
	}
	// static unrender_shape(key: number) {
	// 	this.arr = this.arr.filter((_, i) => i != key);
	// 	return this;
	// }

	static clear_canvas() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
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
