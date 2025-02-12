import { temp_canvas, temp_ctx } from "../../main";
import { Shape } from "../Shapes/Shape";

// only knows about temp_ctx
export class TempCanvasManager {
	public static init() {
		console.log(this.name);
	}

	public static render_shape(Shape: Shape) {
		Shape.render_me_whole(temp_ctx);
		return this;
	}

	public static clear_canvas_only_unrender() {
		temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
		return this;
	}
}
