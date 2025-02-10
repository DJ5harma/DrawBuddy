export abstract class Shape {
	getCopy: () => Shape = () => this; // not this, but copy
	prepare_for_render(_ctx: CanvasRenderingContext2D) {}
	render_me_whole(_ctx: CanvasRenderingContext2D) {}
}
