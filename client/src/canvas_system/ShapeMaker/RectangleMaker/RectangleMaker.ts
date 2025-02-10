import Rectangle from "../../Shape/Rectangle";
import Store from "../../CanvasManager/CanvasManager";
import ShapeMaker from "../ShapeMaker";
import CanvasManager from "../../CanvasManager/CanvasManager";

let draw = false;

let curr = new Rectangle(0, 0, 0, 0);
let prev = new Rectangle(0, 0, 0, 0);

export default class RectangleMaker extends ShapeMaker {
	protected mousedown(e: MouseEvent): void {
		draw = true;
		curr = new Rectangle(e.clientX, e.clientY, 0, 0);
		prev.dims = [0, 0];
		prev.src = [...curr.src];
	}

	protected mousemove(e: MouseEvent): void {
		if (!draw) return;

		prev.make_like(curr);
		CanvasManager.unrender_shape(prev);

		const width = e.clientX - curr.src[0];
		const height = e.clientY - curr.src[1];

		const x = width < 0 ? e.clientX : curr.src[0];
		const y = height < 0 ? e.clientY : curr.src[1];

		curr.dims = [Math.abs(width), Math.abs(height)];
		CanvasManager.render_shape(curr);
	}

	protected mouseup(_: MouseEvent): void {
		draw = false;
		Store.store_shape(curr).render_shape(curr);
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
