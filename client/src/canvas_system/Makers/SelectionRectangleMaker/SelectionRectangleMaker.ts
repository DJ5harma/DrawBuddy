import { temp_ctx } from "../../../main";
import { Maker } from "../Maker";
import { Rectangle } from "../../Shapes/Rectangle";
import { CanvasManager } from "../../Managers/CanvasManager/CanvasManager";
import { SelectionManager } from "../../Managers/SelectionManager";
import { TempCanvasManager } from "../../Managers/TempCanvasManager";

let draw = false;

let curr = new Rectangle({
	pos: [0, 0],
	dims: [0, 0],
	stroke: {
		color: "rgb(5, 247, 255)",
		width: 1,
	},
	fill: "rgba(5, 247, 255, 0.1)",
});

export class SelectionRectangleMaker extends Maker {
	protected mousedown(e: MouseEvent): void {
		if (!SelectionManager.selecting) return;

		draw = true;
		curr.pos = [e.clientX, e.clientY];
		curr.dims = [0, 0];

		curr.prepare_for_render(temp_ctx);
		temp_ctx.beginPath();
		temp_ctx.moveTo(e.clientX, e.clientY);
	}

	protected mousemove(e: MouseEvent): void {
		if (!draw) return;
		const [x, y] = [e.clientX, e.clientY];

		curr.dims = [x - curr.pos[0], y - curr.pos[1]];

		TempCanvasManager.clear_canvas_only_unrender().render_shape(curr);
	}

	protected mouseup(_: MouseEvent): void {
		draw = false;

		let [x, y] = curr.pos;
		let [w, l] = curr.dims;

		if (w < 0) {
			w = -w;
			x -= w;
		}
		if (l < 0) {
			l = -l;
			y -= l;
		}

		CanvasManager.get_shapes().forEach((shape) => {
			if (shape.is_inside_rect({ pos: [x, y], dims: [w, l] }))
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
