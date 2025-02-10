import { ctx } from "../../../main";
import CanvasManager from "../../CanvasManagers/CanvasManager";
import Pencil from "../../Shape/Pencil";
import ShapeMaker from "../ShapeMaker";

let draw = false;

let curr = new Pencil({});

export default class PencilMaker extends ShapeMaker {
	protected mousedown(e: MouseEvent): void {
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
		ctx.lineTo(e.clientX, e.clientY);
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
