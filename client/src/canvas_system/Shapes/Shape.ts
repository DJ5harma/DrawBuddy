export abstract class Shape {
	public get_copy(): Shape {
		return { ...this };
	}

	public prepare_for_render(_ctx: CanvasRenderingContext2D) {}

	public render_me_whole(_ctx: CanvasRenderingContext2D) {}

	public is_inside_rect(_rect: { pos: vec2; dims: vec2 }): boolean {
		return false;
	}

	public displace_by(_displacement: vec2) {}
}
