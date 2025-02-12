import { ctx } from "../../../main";
import { CanvasDragger } from "../../Managers/CanvasManager/CanvasDragger";
import { CanvasManager } from "../../Managers/CanvasManager/CanvasManager";
import { Pencil } from "../../Shapes/Pencil";
import { Maker } from "../Maker";

let draw = false;

let curr = new Pencil({});

export class PencilMaker extends Maker {
	protected mousedown(e: MouseEvent): void {
		if (e.button !== 0) return;

		draw = true;

		curr.points = [];
		curr.prepare_for_render();

		const [loc_x, loc_y] = CanvasDragger.get_location();

		ctx.moveTo(e.clientX - loc_x, e.clientY - loc_y);
		ctx.beginPath();

		curr.points = [[e.clientX, e.clientY]];
	}

	protected mousemove(e: MouseEvent): void {
		// console.log("mouse move");

		if (!draw) return;

		const [loc_x, loc_y] = CanvasDragger.get_location();
		const [x, y] = [e.clientX - loc_x, e.clientY - loc_y];

		curr.points.push([x, y]);

		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.moveTo(x, y);
	}

	protected mouseup(_: MouseEvent): void {
		draw = false;
		ctx.closePath();
		CanvasManager.store_shape(curr);
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
