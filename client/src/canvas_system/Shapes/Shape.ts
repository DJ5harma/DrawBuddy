export abstract class Shape {
	get_copy(): Shape {
		return { ...this };
	} // not this, but copy

	prepare_for_render(_ctx: CanvasRenderingContext2D) {}

	render_me_whole(_ctx: CanvasRenderingContext2D) {}

	calculate_rects() {}

	is_inside_rect(_rect: { src: vec2; dims: vec2 }): boolean {
		return false;
	}
}
