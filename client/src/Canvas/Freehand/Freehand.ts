import { ctx } from "../../main";

let draw = false;

export class Freehand {
	static mousedown(e: MouseEvent) {
		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
		draw = true;
	}

	static mousemove(e: MouseEvent) {
		if (!draw) return;
		ctx.lineTo(e.clientX, e.clientY);
		ctx.stroke();
		ctx.moveTo(e.clientX, e.clientY);
	}

	static mouseup(e: MouseEvent) {
		draw = false;
		ctx.closePath();
	}
}
