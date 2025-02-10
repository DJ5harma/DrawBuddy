import { ctx } from "../../main";
import { Shape } from "./Shape";

export default class Rectangle extends Shape {
	src;
	dims;
	stroke;

	constructor({
		src,
		dims,
		stroke,
	}: {
		src: vec2;
		dims: vec2;
		stroke?: {
			width?: number;
			color?: string;
		};
	}) {
		super();
		this.src = src;
		this.dims = dims;
		this.stroke = { width: 5, color: "white", ...stroke };
	}

	prepare_for_render(): void {
		ctx.strokeStyle = this.stroke.color;
		ctx.lineWidth = this.stroke.width;
	}

	render_me_whole(): void {
		this.prepare_for_render();
		let [x, y] = this.src;
		let [w, l] = this.dims;

		if (w < 0) {
			w = -w;
			x -= w;
		}
		if (l < 0) {
			l = -l;
			y -= l;
		}
		ctx.strokeRect(x, y, w, l);
	}
	unrender_me_whole(): void {}

	get_copy() {
		return new Rectangle({
			src: [...this.src],
			dims: [...this.dims],
			stroke: { ...this.stroke },
		});
	}
	make_like(r: Rectangle) {
		this.src = [...r.src] as vec2;
		this.dims = [...r.dims] as vec2;
		this.stroke = { ...r.stroke };
	}
}
