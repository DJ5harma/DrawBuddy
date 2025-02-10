import { ctx } from "../../main";
import { Shape } from "./Shape";

export default class Rectangle extends Shape {
	src;
	dims;
	constructor(x: number, y: number, w: number, h: number) {
		super();
		this.src = [x, y];
		this.dims = [w, h];
	}
	render_me_whole(): void {
		ctx.strokeRect(
			this.src[0],
			this.src[1],
			Math.abs(this.dims[0]),
			Math.abs(this.dims[1])
		);
	}
	unrender_me_whole(): void {}

	get_copy() {
		return new Rectangle(this.src[0], this.src[1], this.dims[0], this.dims[1]);
	}
	make_like(r: Rectangle) {
		this.src = [...r.src];
		this.dims = [...r.dims];
	}
}
