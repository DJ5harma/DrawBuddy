import { ctx } from "../../../main";
import { Rectangle } from "../../Shape/Rectangle/Rectangle";
import { Store } from "../../Store/Store";
import ShapeMaker from "../ShapeMaker";

let prev = [0, 0, 0, 0];
let draw = false;

let rectangle = new Rectangle(0, 0, 0, 0);

export default class RectangleMaker extends ShapeMaker {
	mousedown(e: MouseEvent): void {
		draw = true;
		rectangle = new Rectangle(e.clientX, e.clientY, 0, 0);
		prev = [...rectangle.src, 0, 0];
	}

	mousemove(e: MouseEvent): void {
		if (!draw) return;

		ctx.clearRect(prev[0] - 1, prev[1] - 1, prev[2] + 2, prev[3] + 2);

		const width = e.clientX - rectangle.src[0];
		const height = e.clientY - rectangle.src[1];

		const x = width < 0 ? e.clientX : rectangle.src[0];
		const y = height < 0 ? e.clientY : rectangle.src[1];

		prev = [x, y, Math.abs(width), Math.abs(height)];

		ctx.strokeRect(x, y, Math.abs(width), Math.abs(height));
	}

	mouseup(_: MouseEvent): void {
		draw = false;
		Store.store_and_render_shape(rectangle);
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
