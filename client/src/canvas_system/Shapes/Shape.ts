export abstract class Shape {
	// pos: vec2;

	// constructor(_pos?: vec2) {
	// 	this.pos = _pos || [0, 0];
	// }

	// displace_by(_gap: vec2) {}

	get_copy(): Shape {
		return { ...this };
	}

	prepare_for_render(_ctx: CanvasRenderingContext2D) {}

	render_me_whole(_ctx: CanvasRenderingContext2D) {}

	is_inside_rect(_rect: { pos: vec2; dims: vec2 }): boolean {
		return false;
	}
}
