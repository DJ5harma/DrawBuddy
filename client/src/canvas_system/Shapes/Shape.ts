export abstract class Shape {
	get_copy(): Shape {
		return { ...this };
	}

	prepare_for_render(_ctx: CanvasRenderingContext2D) {}

	render_me_whole(_ctx: CanvasRenderingContext2D) {}

	is_inside_rect(_rect: { pos: vec2; dims: vec2 }): boolean {
		return false;
	}

	displace_by(_displacement: vec2) {}
}
