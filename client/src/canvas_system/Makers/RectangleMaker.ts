import { Rectangle } from "../Shapes/Rectangle";
import { Maker } from "./Maker";
import { CanvasManager } from "../Managers/CanvasManager";
import { ctx, temp_ctx } from "../../main";
import { TempCanvasManager } from "../Managers/TempCanvasManager";

let draw = false;

let curr = new Rectangle({
	pos: [0, 0],
	dims: [0, 0],
	fill: "rgb(255, 255, 255)",
	stroke: { color: "rgb(255, 0, 255)", width: 5 },
});

export class RectangleMaker extends Maker {
	protected mousedown(e: MouseEvent): void {
		if (e.button !== 0) return;

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

	protected mouseup(e: MouseEvent): void {
		if (e.button !== 0) return;
		draw = false;
		CanvasManager.store_shape(curr).render_shape(curr);
		TempCanvasManager.clear_canvas_only_unrender();
		ctx.closePath();
	}

	start(): void {
		document.addEventListener("mousedown", this.mousedown);
		document.addEventListener("mousemove", this.mousemove);
		document.addEventListener("mouseup", this.mouseup);
	}
	stop(): void {
		document.removeEventListener("mousedown", this.mousedown);
		document.removeEventListener("mousemove", this.mousemove);
		document.removeEventListener("mouseup", this.mouseup);
	}
}
