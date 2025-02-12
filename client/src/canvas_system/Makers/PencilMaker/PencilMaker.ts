import { ctx } from "../../../main";
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

		ctx.moveTo(e.clientX, e.clientY);
		ctx.beginPath();

		curr.points = [[e.clientX, e.clientY]];
	}

	protected mousemove(e: MouseEvent): void {
		// console.log("mouse move");

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
