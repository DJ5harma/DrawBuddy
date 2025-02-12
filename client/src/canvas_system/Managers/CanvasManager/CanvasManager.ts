import { canvas, ctx } from "../../../main";
import { Shape } from "../../Shapes/Shape";
import { CanvasDragger } from "./CanvasDragger";

// only knows about real ctx
export class CanvasManager {
	private static arr: Shape[] = [];

	static init() {
		console.log(this.name);
		CanvasDragger.init();
	}

	static get_shapes() {
		return this.arr;
	}

	static store_shape(Shape: Shape) {
		this.arr.push(Shape.get_copy());
		// console.log(this.arr);

		return this;
	}

	static pop_shape() {
		return this.arr.pop();
	}

	static render_shape(Shape: Shape) {
		Shape.render_me_whole(ctx);
		return this;
	}

	static render_stored_shapes_all() {
		this.arr.forEach((Shape) => this.render_shape(Shape));
		return this;
	}

	static clear_canvas_only_unrender() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		return this;
	}

	static clear_canvas_fully() {
		this.clear_canvas_only_unrender();
		this.arr = [];
		return this;
	}
}
