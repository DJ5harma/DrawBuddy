import { canvas, ctx } from "../../main";
import { Shape } from "../Shape/Shape";

export default class ShapeManager {
	private static arr: Shape[] = [];

	static init() {}

	static store_shape(Shape: Shape) {
		this.arr.push(Shape);
		return this;
	}
	static render_shape(Shape: Shape) {
		Shape.render_me();
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
	static unrender_shape(key: number) {
		this.arr = this.arr.filter((_, i) => i != key);
		return this;
	}

	static unrender_all_shapes() {
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
