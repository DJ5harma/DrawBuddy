export abstract class Shape {
    abstract bounding_rect: BoundingRect | undefined;
    resize_handle : ResizeHandle = undefined

    abstract fill?: Color;
    abstract stroke?: Stroke;

    public abstract get_copy(): Shape;

    public abstract prepare_for_render(_ctx: CanvasRenderingContext2D): void;

    public abstract render_me_whole(_ctx: CanvasRenderingContext2D): void;

    public abstract is_inside_rect(_rect: { pos: vec2; dims: vec2 }): boolean;

    public abstract displace_by(_displacement: vec2): void;

    public static start_interaction(_touch_pos:vec2, shape: Shape): void {
        console.log("setting dir");
        const [x, y] = _touch_pos;


        if (shape.bounding_rect) {
            
            const left = shape.bounding_rect.top_left[0];
            const right = shape.bounding_rect.bottom_right[0];
            const top = shape.bounding_rect.top_left[1];
            const bottom = shape.bounding_rect.bottom_right[1];
            if(x - left <= 10 && y - top <= 10){
                shape.resize_handle = 'nw'
            }
            else if(x - left <= 10 && bottom - y <= 10){
                shape.resize_handle = 'sw'
            }
            else if(right - x <= 10 && y - top <= 10){
                shape.resize_handle = 'ne'
            }
            else if(right - x <= 10 && bottom - y <= 10){
                shape.resize_handle = 'sw'
            }
            else if(x - left <= 10){
                shape.resize_handle = 'w'
            }
            else if(y - top <= 10){
                shape.resize_handle = 'n'
            }
            else if(right - x <= 10){
                shape.resize_handle = 'e'
            }
            else if(bottom - y <= 10){
                shape.resize_handle = 's'
            }
            console.log("setting dir to :" , shape.resize_handle);
        }
    };

    public abstract start_resizing_shapes(_touch_pos:vec2): void;
}
