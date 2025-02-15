export abstract class Shape {
    abstract bounding_rect: BoundingRect | undefined;
    resize_handle: ResizeHandle = undefined;

    abstract fill?: Color;
    abstract stroke?: Stroke;

    public abstract get_copy(): Shape;

    public abstract prepare_for_render(_ctx: CanvasRenderingContext2D): void;

    public abstract render_me_whole(_ctx: CanvasRenderingContext2D): void;

    public abstract is_inside_rect(_rect: { pos: vec2; dims: vec2 }): boolean;

    public abstract displace_by(_displacement: vec2): void;

    // public abstract ensure_bounding_rect(): void;

    public abstract fix_maths(): void;

    public abstract resize_by(_delta_xy: vec2): void;
}
