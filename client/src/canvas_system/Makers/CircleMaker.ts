import { Circle } from "../Shapes/Circle";
import { Maker } from "./Maker";
import { CanvasManager } from "../Managers/CanvasManager";
import { temp_ctx } from "../../main";
import { TempCanvasManager } from "../Managers/TempCanvasManager";
import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";

let draw = false;

let curr = new Circle({
	pos: [0, 0],
	radius: 0,
	fill: "rgb(255, 255, 255)",
	stroke: { color: "rgb(255, 0, 255)", width: 5 },
});

export class CircleMaker extends Maker {
	protected mousedown(e: MouseEvent): void {
		if (e.button !== 0) return;

		draw = true;

		curr.pos = [e.clientX, e.clientY];
		curr.radius = 0;

		curr.fill = ToolPallete.fill;
		curr.stroke = {
			color: ToolPallete.stroke.color,
			width: ToolPallete.stroke.width,
		};

		curr.prepare_for_render(temp_ctx);
	}

	protected mousemove(e: MouseEvent): void {
		if (!draw) return;
		const [x, y] = [e.clientX, e.clientY];
		const dx = x - curr.pos[0];
		const dy = y - curr.pos[1];

		curr.radius = Math.sqrt(dx * dx + dy * dy);

		this.ensure_bounding_rect();
		TempCanvasManager.clear_canvas_only_unrender().render_shape(curr);
	}

	ensure_bounding_rect(): void {
		curr.bounding_rect = {
			top_left: [curr.pos[0] - curr.radius, curr.pos[1] - curr.radius],
			bottom_right: [curr.pos[0] + curr.radius, curr.pos[1] + curr.radius],
		};
	}

	protected mouseup(e: MouseEvent): void {
		if (e.button !== 0) return;
		draw = false;
		CanvasManager.store_shape(curr).render_shape(curr);
		TempCanvasManager.clear_canvas_only_unrender();
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
