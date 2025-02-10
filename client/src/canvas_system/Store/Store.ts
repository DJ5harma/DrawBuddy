import { canvas, ctx } from "../../main";
import { Shape } from "../Shape/Shape";

export class Store {
	static arr: Shape[] = [];

	static store_shape(Shape: Shape) {
		this.arr.push(Shape);
	}
	static render_shape(Shape: Shape) {
		Shape.render_me();
	}
	static store_and_render_shape(Shape: Shape) {
		this.store_shape(Shape);
		this.render_shape(Shape);
	}

	static unstore_shape(key: number) {
		this.arr = this.arr.filter((_, i) => i != key);
	}
	static unrender_shape(key: number) {
		this.arr = this.arr.filter((_, i) => i != key);
	}
	static unstore_and_unrender_shape(key: number) {
		this.unstore_shape(key);
		this.unrender_shape(key);
	}

	static unrender_all_shapes() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	static render_stored_shapes() {
		this.arr.forEach((Shape) => this.render_shape(Shape));
	}
	static update_canvas() {
		this.unrender_all_shapes();
		this.render_stored_shapes();
	}

	static get_shapes_inside(x1: number, y1: number, x2: number, y2: number) {
		return [];
	}
}
