import { Shape } from "./Shape";

export class Rectangle extends Shape {
	src;
	dims;
	stroke;
	fill;

	constructor({
		src,
		dims,
		stroke,
		fill,
	}: {
		src?: vec2;
		dims?: vec2;
		stroke?: Stroke;
		fill?: Color;
	}) {
		super();
		this.src = src || [-1, -1];
		this.dims = dims || [0, 0];
		this.stroke = { width: 5, color: "rgba(255,255,255,1)", ...stroke };
		this.fill = fill || "rgba(255, 251, 0, 0.5)";
	}

	prepare_for_render(ctx: CanvasRenderingContext2D): void {
		ctx.strokeStyle = this.stroke.color;
		ctx.lineWidth = this.stroke.width;
	}

	render_me_whole(ctx: CanvasRenderingContext2D): void {
		this.prepare_for_render(ctx);
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
		ctx.fillStyle = this.fill;
		ctx.fillRect(x, y, w, l);
	}

	get_copy() {
		const copy = new Rectangle({});
		copy.make_like(this);
		return copy;
	}

	make_like(r: Rectangle) {
		this.src = [...r.src] as vec2;
		this.dims = [...r.dims] as vec2;
		this.stroke = { ...r.stroke };
	}

	is_inside_rect(_rect: { src: vec2; dims: vec2 }): boolean {
		const { src, dims } = _rect;

		return (
			src[0] < this.src[0] &&
			src[1] < this.src[1] &&
			src[0] + dims[0] > this.src[0] + this.dims[0] &&
			src[1] + dims[1] > this.src[1] + this.dims[1]
		);
	}
}
