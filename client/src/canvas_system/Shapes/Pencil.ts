import { ctx } from "../../main";
import { Shape } from "./Shape";

export class Pencil extends Shape {
	points: vec2[];
	stroke;

	constructor({
		stroke,
	}: {
		stroke?: {
			width?: number;
			color?: string;
		};
	}) {
		super();
		this.points = [];
		this.stroke = { width: 5, color: "white", ...stroke };
	}

	prepare_for_render() {
		ctx.strokeStyle = this.stroke.color;
		ctx.lineWidth = this.stroke.width;
	}

	render_me_whole(): void {
		// console.log("rendering whole Pencil");
		const pts = this.points;
		if (pts.length < 2) return;

		this.prepare_for_render();
		ctx.beginPath();

		ctx.moveTo(pts[0][0], pts[0][1]);

		for (let i = 1; i < pts.length; ++i) {
			const [x2, y2] = [pts[i][0], pts[i][1]];

			ctx.lineTo(x2, y2);
			ctx.stroke();
			ctx.moveTo(x2, y2);
		}
	}

	get_copy() {
		const copy = new Pencil({});
		copy.make_like(this);
		return copy;
	}
	make_like(f: Pencil) {
		this.points = [...f.points];
	}

	is_inside_rect(_rect: { pos: vec2; dims: vec2 }): boolean {
		const pts = this.points;

		if (!pts.length) return false;

		const dims = _rect.dims;

		let [min_x, min_y] = pts[0];
		let [max_x, max_y] = pts[0];

		const pos = _rect.pos;

		pts.forEach(([x, y]) => {
			min_x = Math.min(min_x, x);
			min_y = Math.min(min_y, y);

			max_x = Math.max(max_x, x);
			max_y = Math.max(max_y, y);
		});

		return (
			pos[0] < min_x &&
			pos[1] < min_y &&
			pos[0] + dims[0] > max_x &&
			pos[1] + dims[1] > max_y
		);
	}

	displace_by(_displacement: vec2): void {
		const [x, y] = _displacement;

		this.points.forEach((pt) => {
			pt[0] += x;
			pt[1] += y;
		});
	}
}
