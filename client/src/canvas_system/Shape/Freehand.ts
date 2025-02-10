import { ctx } from "../../main";
import { Shape } from "./Shape";

export default class Freehand extends Shape {
	points: vec2[];
	stroke: {
		width: number;
		color: string;
	};

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
		console.log("rendering whole Freehand");
		// return;

		const pts = this.points;
		if (pts.length < 2) return;

		this.prepare_for_render();

		ctx.beginPath();
		ctx.moveTo(pts[0][0], pts[0][1]);

		for (let i = 1; i < pts.length; ++i) {
			const [x2, y2] = pts[i];
			ctx.lineTo(x2, y2);
			ctx.stroke();
			ctx.moveTo(x2, y2);
		}
	}

	get_copy() {
		const copy = new Freehand({ stroke: this.stroke });
		copy.make_like(this);
		return copy;
	}
	make_like(f: Freehand) {
		this.points = [...f.points];
		// this.src = [...r.src];
		// this.dims = [...r.dims];
	}
}
