import { buffer_canvas, buffer_ctx } from "../../main";
import { Shape } from "./Shape";

export class Pencil implements Shape {
	points: vec2[];
	stroke: Stroke;

	cached_bounding_rect?: {
		min_x: number;
		min_y: number;
		max_x: number;
		max_y: number;
	};

	cached_image_data?: { img: ImageData; sx: number; sy: number };

	constructor({ stroke }: { stroke: Stroke }) {
		this.points = [];
		this.stroke = { ...stroke };
		this.cached_bounding_rect = undefined;
	}

	public prepare_for_render(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = this.stroke.color;
		ctx.lineWidth = this.stroke.width;
	}

	public render_me_whole(ctx: CanvasRenderingContext2D): void {
		console.log("retrived image data: ", this.cached_image_data);

		if (this.cached_image_data) {
			buffer_ctx.putImageData(this.cached_image_data.img, 0, 0);

			// Now draw it without erasing existing content
			ctx.drawImage(
				buffer_canvas,
				this.cached_image_data.sx,
				this.cached_image_data.sy
			);

			buffer_ctx.clearRect(0, 0, buffer_canvas.width, buffer_canvas.height);
			return;
		} else {
			console.error(
				"A pencil drawing was requested but its cached image data was not found"
			);
		}
	}

	public get_copy() {
		const copy = new Pencil({ stroke: { ...this.stroke } });
		copy.make_like(this);
		return copy;
	}

	public make_like(p: Pencil) {
		this.points = [...p.points];
		this.stroke = { ...p.stroke };
		this.cached_image_data = p.cached_image_data
			? { ...p.cached_image_data }
			: undefined;
		this.cached_bounding_rect = p.cached_bounding_rect
			? { ...p.cached_bounding_rect }
			: undefined;
	}

	public is_inside_rect(_rect: { pos: vec2; dims: vec2 }): boolean {
		let min_x: number, max_x: number, min_y: number, max_y: number;

		if (this.cached_bounding_rect) {
			min_x = this.cached_bounding_rect.min_x;
			max_x = this.cached_bounding_rect.max_x;
			min_y = this.cached_bounding_rect.min_y;
			max_y = this.cached_bounding_rect.max_y;
		} else {
			const pts = this.points;
			min_x = pts[0][0];
			min_y = pts[0][1];

			max_x = pts[0][0];
			max_y = pts[0][1];

			if (!pts.length) return false;

			pts.forEach(([x, y]) => {
				min_x = Math.min(min_x, x);
				min_y = Math.min(min_y, y);

				max_x = Math.max(max_x, x);
				max_y = Math.max(max_y, y);
			});

			this.cached_bounding_rect = { min_x, min_y, max_x, max_y };
		}
		const dims = _rect.dims;
		const pos = _rect.pos;

		return (
			pos[0] < min_x &&
			pos[1] < min_y &&
			pos[0] + dims[0] > max_x &&
			pos[1] + dims[1] > max_y
		);
	}

	public displace_by(_displacement: vec2): void {
		const [x, y] = _displacement;
		for (let i = 0; i < this.points.length; ++i) {
			this.points[i][0] += x;
			this.points[i][1] += y;
		}
		if (this.cached_bounding_rect) {
			this.cached_bounding_rect.min_x += x;
			this.cached_bounding_rect.max_x += x;
			this.cached_bounding_rect.min_y += y;
			this.cached_bounding_rect.max_y += y;
		}

		if (this.cached_image_data) {
			this.cached_image_data.sx += x;
			this.cached_image_data.sy += y;
		}
	}
}
