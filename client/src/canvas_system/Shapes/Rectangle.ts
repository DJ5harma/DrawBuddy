import { Shape } from "./Shape";

export class Rectangle extends Shape {
	pos: vec2;
	dims;
	stroke;
	fill;

	constructor({
		pos,
		dims,
		stroke,
		fill,
	}: {
		pos?: vec2;
		dims?: vec2;
		stroke?: Stroke;
		fill?: Color;
	}) {
		super();
		this.pos = pos || [0, 0];
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

		let [x, y] = this.pos;
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
		this.pos = [...r.pos] as vec2;
		this.dims = [...r.dims] as vec2;
		this.stroke = { ...r.stroke };
	}

	is_inside_rect(_rect: { pos: vec2; dims: vec2 }): boolean {
		const { pos, dims } = _rect;

		return (
			pos[0] < this.pos[0] &&
			pos[1] < this.pos[1] &&
			pos[0] + dims[0] > this.pos[0] + this.dims[0] &&
			pos[1] + dims[1] > this.pos[1] + this.dims[1]
		);
	}
	displace_by(_displacement: vec2): void {
		const [x, y] = _displacement;

		this.pos[0] += x;
		this.pos[1] += y;
	}
}
