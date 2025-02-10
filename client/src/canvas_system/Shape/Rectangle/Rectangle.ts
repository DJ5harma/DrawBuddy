import { Shape } from "../Shape";

export class Rectangle extends Shape {
	src;
	dims;
	constructor(x: number, y: number, w: number, h: number) {
		super();
		this.src = [x, y];
		this.dims = [w, h];
	}
	render_me(): void {}
	remove_me(): void {}
}
