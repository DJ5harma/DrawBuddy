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

	configure_ctx() {
		ctx.strokeStyle = this.stroke.color;
		ctx.lineWidth = this.stroke.width;
	}

	render_me_whole(): void {
		console.log("rendering whole Freehand");

		const pts = this.points;
		if (!pts.length) return;

		this.configure_ctx();

		ctx.moveTo(pts[0][0], pts[0][1]);
		ctx.beginPath();
		for (let i = 1; i < pts.length; ++i) {
			const [x, y] = pts[i];
			ctx.lineTo(x, y);
			ctx.moveTo(x, y);
		}
	}
	unrender_me_whole(): void {
		console.log("unrender_me_whole by Freehand");
	}

	get_copy() {
		const copy = new Freehand({ stroke: this.stroke });
		copy.points = this.points;
		return copy;
	}
	make_like(f: Freehand) {
		this.points = [...f.points];
		// this.src = [...r.src];
		// this.dims = [...r.dims];
	}
}
