import { ctx } from "../../main";
import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";
import { CanvasManager } from "../Managers/CanvasManager";
import { Pencil } from "../Shapes/Pencil";
import { Maker } from "./Maker";

let draw = false;

let curr = new Pencil({ stroke: { color: "rgb(255, 255, 255)", width: 5 } });

export class PencilMaker extends Maker {
	protected mousedown(e: MouseEvent): void {
		if (e.button !== 0) return;

		draw = true;

		curr.stroke = {
			color: ToolPallete.stroke.color,
			width: ToolPallete.stroke.width,
		};

		curr.prepare_for_render(ctx);

		ctx.moveTo(e.clientX, e.clientY);
		ctx.beginPath();

		curr.points = [[e.clientX, e.clientY]];
	}

	protected mousemove(e: MouseEvent): void {
		if (!draw) return;

		const [x, y] = [e.clientX, e.clientY];

		curr.points.push([x, y]);

		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.moveTo(x, y);
	}

	protected mouseup(e: MouseEvent): void {
		if (e.button !== 0) return;
		draw = false;
		ctx.closePath();
		CanvasManager.store_shape(curr);
	}

	public set_config(_config: { stroke: Stroke }): void {
		curr.stroke = _config.stroke;
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
