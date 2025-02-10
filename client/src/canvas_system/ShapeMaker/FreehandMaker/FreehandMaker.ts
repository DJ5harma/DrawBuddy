import { ctx } from "../../../main";
import ShapeMaker from "../ShapeMaker";

let draw = false;

export default class FreehandMaker extends ShapeMaker {
	mousedown(e: MouseEvent): void {
		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
		draw = true;
	}

	mousemove(e: MouseEvent): void {
		if (!draw) return;
		ctx.lineTo(e.clientX, e.clientY);
		ctx.stroke();
		ctx.moveTo(e.clientX, e.clientY);
	}

	mouseup(_: MouseEvent): void {
		draw = false;
		ctx.closePath();
	}

	start(): void {}
	stop(): void {}
}
