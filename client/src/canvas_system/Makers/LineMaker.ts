import { Line } from "../Shapes/Line";
import { Maker } from "./Maker";
import { CanvasManager } from "../Managers/CanvasManager";
import { ctx, temp_ctx } from "../../main";
import { TempCanvasManager } from "../Managers/TempCanvasManager";
import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";

let draw = false;

let curr = new Line({
	start: [0, 0],
	end: [0, 0],
	stroke: { color: "rgb(255, 0, 255)", width: 5 },
});

export class LineMaker extends Maker {
	protected mousedown(e: MouseEvent): void {
		if (e.button !== 0) return;

		draw = true;

		curr.start = [e.clientX, e.clientY];
		curr.end = [...curr.start];

		curr.stroke = {
			color: ToolPallete.stroke.color,
			width: ToolPallete.stroke.width,
		};

		curr.prepare_for_render(temp_ctx);
	}

	protected mousemove(e: MouseEvent): void {
		if (!draw) return;

		curr.end = [e.clientX, e.clientY];
		TempCanvasManager.clear_canvas_only_unrender().render_shape(curr);
	}

	protected mouseup(e: MouseEvent): void {
		if (e.button !== 0) return;
		draw = false;
		curr.end = [e.clientX, e.clientY];
		ctx.closePath();

		this.ensure_bounding_rect();
		CanvasManager.store_shape(curr).render_shape(curr);
		TempCanvasManager.clear_canvas_only_unrender();
	}

	ensure_bounding_rect(): void {
		curr.bounding_rect = {
			top_left: [...curr.start],
			bottom_right: [...curr.end],
		};
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
