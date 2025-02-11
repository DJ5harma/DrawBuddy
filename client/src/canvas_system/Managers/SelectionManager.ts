import { temp_ctx } from "../../main";
import ShapeMaker from "../ShapeMakers/ShapeMaker";
import Rectangle from "../Shapes/Rectangle";
import CanvasManager from "./CanvasManager";
import TempCanvasManager from "./TempCanvasManager";

let draw = false;

let curr = new Rectangle({
	src: [0, 0],
	dims: [0, 0],
	stroke: {
		color: "cyan",
	},
});

class SelectionRectangleMaker extends ShapeMaker {
	protected mousedown(e: MouseEvent): void {
		if (!SelectionManager.selecting) return;

		draw = true;
		curr.src = [e.clientX, e.clientY];
		curr.dims = [0, 0];

		curr.prepare_for_render(temp_ctx);
		temp_ctx.beginPath();
		temp_ctx.moveTo(e.clientX, e.clientY);
	}

	protected mousemove(e: MouseEvent): void {
		if (!draw) return;
		const [x, y] = [e.clientX, e.clientY];

		curr.dims = [x - curr.src[0], y - curr.src[1]];

		TempCanvasManager.clear_canvas_only_unrender().render_shape(curr);
	}

	protected mouseup(_: MouseEvent): void {
		draw = false;

		const shapes = CanvasManager.get_shapes();

		let [x, y] = curr.src;
		let [w, l] = curr.dims;

		if (w < 0) {
			w = -w;
			x -= w;
		}
		if (l < 0) {
			l = -l;
			y -= l;
		}

		shapes.forEach((shape) => {
			if (shape.is_inside_rect({ src: [x, y], dims: [w, l] }))
				console.log("INSIDE: ", shape);
		});
		document.removeEventListener("mousedown", this.mousedown);
		document.removeEventListener("mousemove", this.mousemove);
		document.removeEventListener("mouseup", this.mouseup);

		TempCanvasManager.clear_canvas_only_unrender();
	}

	public start(): void {
		document.addEventListener("mousedown", this.mousedown);
		document.addEventListener("mousemove", this.mousemove);
		document.addEventListener("mouseup", this.mouseup);
	}
}

export default class SelectionManager {
	static selecting = false;

	static start_selection_lifecycle() {
		this.selecting = true;
		const rect_maker = new SelectionRectangleMaker();
		rect_maker.start();
	}

	static stop_selection() {
		this.selecting = false;
	}
}
