import { Shape } from "./Shape";

export class Line implements Shape {
	start: vec2;
	end: vec2;
	stroke;

	constructor({
		start,
		end,
		stroke,
	}: {
		start: vec2;
		end: vec2;
		stroke: Stroke;
	}) {
		this.start = [...start];
		this.end = [...end];
		this.stroke = stroke;
	}

	public prepare_for_render(ctx: CanvasRenderingContext2D): void {
		ctx.strokeStyle = this.stroke.color;
		ctx.lineWidth = this.stroke.width;
	}

	public render_me_whole(ctx: CanvasRenderingContext2D): void {
		this.prepare_for_render(ctx);

		ctx.beginPath();
		ctx.moveTo(...this.start);
		ctx.lineTo(...this.end);
		ctx.stroke();
		ctx.closePath();
	}

	public get_copy() {
		const copy = new Line({
			start: [...this.start],
			end: [...this.end],
			stroke: { ...this.stroke },
		});
		copy.make_like(this);
		return copy;
	}

	public make_like(r: Line) {
		this.start = [...r.start] as vec2;
		this.end = [...r.end] as vec2;
		this.stroke = { ...r.stroke };
	}

	public is_inside_rect(_rect: { pos: vec2; dims: vec2 }): boolean {
		const { pos, dims } = _rect;

		return (
			pos[0] < this.start[0] &&
			pos[1] < this.start[1] &&
			pos[0] + dims[0] > this.start[0] + this.end[0] &&
			pos[1] + dims[1] > this.start[1] + this.end[1]
		);
	}
	public displace_by(_displacement: vec2): void {
		const [x, y] = _displacement;

		this.start[0] += x;
		this.start[1] += y;

		this.end[0] += x;
		this.end[1] += y;
	}
}
