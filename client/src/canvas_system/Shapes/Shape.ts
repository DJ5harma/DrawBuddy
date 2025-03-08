export abstract class Shape {
    abstract fill?: Color;
    abstract stroke?: Stroke;

    public abstract prepare_for_render(_ctx: CanvasRenderingContext2D): void;

    public abstract render_me_whole(_ctx: CanvasRenderingContext2D): void;

    public abstract get_bounding_rect(): BoundingRect;
}
