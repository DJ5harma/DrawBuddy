import { ctx } from "../../main";

let src: vec2 = [-1, -1];
let prev = [0, 0, 0, 0];
let draw = false;

export class Rectangle {
	static mousedown(e: MouseEvent) {
		draw = true;
		src = [e.clientX, e.clientY];
		prev = [...src, 0, 0];
	}

	static mousemove(e: MouseEvent) {
		if (!draw) return;

		ctx.clearRect(prev[0] - 1, prev[1] - 1, prev[2] + 2, prev[3] + 2);

		const width = e.clientX - src[0];
		const height = e.clientY - src[1];

		const x = width < 0 ? e.clientX : src[0];
		const y = height < 0 ? e.clientY : src[1];

		prev = [x, y, Math.abs(width), Math.abs(height)];

		ctx.strokeRect(x, y, Math.abs(width), Math.abs(height));
	}

	static mouseup() {
		draw = false;
	}
}
