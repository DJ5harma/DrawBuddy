export abstract class Shape {
	inner_rect: { src: vec2; dims: vec2 } = { src: [0, 0], dims: [0, 0] };
	outer_rect: { src: vec2; dims: vec2 } = { src: [0, 0], dims: [0, 0] };
	getCopy: () => Shape = () => this; // not this, but copy
	prepare_for_render(_ctx: CanvasRenderingContext2D) {}
	render_me_whole(_ctx: CanvasRenderingContext2D) {}
	calculate_rects() {}
}
