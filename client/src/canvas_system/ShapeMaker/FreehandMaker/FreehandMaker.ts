import { ctx } from "../../../main";
import CanvasManager from "../../CanvasManager/CanvasManager";
import Freehand from "../../Shape/Freehand";
import ShapeMaker from "../ShapeMaker";

let draw = false;

const curr = new Freehand({});

export default class FreehandMaker extends ShapeMaker {
	protected mousedown(e: MouseEvent): void {
		curr.prepare_for_render();
		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
		curr.points = [[e.clientX, e.clientY]];
		draw = true;
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
		CanvasManager.store_shape(curr.get_copy());
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
