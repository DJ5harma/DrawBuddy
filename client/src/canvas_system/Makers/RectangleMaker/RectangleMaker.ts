import { Rectangle } from "../../Shapes/Rectangle";
import { Maker } from "../Maker";
import { CanvasManager } from "../../Managers/CanvasManager";
import { temp_ctx } from "../../../main";
import { TempCanvasManager } from "../../Managers/TempCanvasManager";

let draw = false;

let curr = new Rectangle({ src: [0, 0], dims: [0, 0] });

export class RectangleMaker extends Maker {
	protected mousedown(e: MouseEvent): void {
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
		CanvasManager.store_shape(curr).render_shape(curr);
	}

	public set_config(_config: { stroke: Stroke }): void {
		const { stroke } = _config;
		curr.stroke = { ...curr.stroke, ...stroke };
	}

	public start(): void {
		document.addEventListener("mousedown", this.mousedown);
		document.addEventListener("mousemove", this.mousemove);
		document.addEventListener("mouseup", this.mouseup);
	}
	public stop(): void {
		document.removeEventListener("mousedown", this.mousedown);
		document.removeEventListener("mousemove", this.mousemove);
		document.removeEventListener("mouseup", this.mouseup);
	}
}
