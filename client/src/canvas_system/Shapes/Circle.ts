import { Shape } from "./Shape";

export class Circle implements Shape {
    pos;
    radius;
    stroke;
    fill;
    bounding_rect: BoundingRect | undefined;
    resize_handle: ResizeHandle;

    constructor({
        pos,
        radius,
        stroke,
        fill,
    }: {
        pos: vec2;
        radius: number;
        stroke: Stroke;
        fill: Color;
    }) {
        this.pos = pos;
        this.radius = radius;
        this.stroke = stroke;
        this.fill = fill;
    }

    public prepare_for_render(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.stroke.color;
        ctx.lineWidth = this.stroke.width;
    }

    public render_me_whole(ctx: CanvasRenderingContext2D): void {
        this.prepare_for_render(ctx);

        let [x, y] = this.pos;
        const positiveRadius = Math.abs(this.radius);

        ctx.beginPath();
        ctx.arc(x, y, positiveRadius, 0, 2 * Math.PI);
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.stroke();
    }

    public get_copy() {
        const copy = new Circle({
            radius: this.radius,
            fill: this.fill,
            pos: { ...this.pos },
            stroke: { ...this.stroke },
        });
        copy.make_like(this);
        return copy;
    }

    public make_like(r: Circle) {
        this.pos = [...r.pos] as vec2;
        this.radius = r.radius;
        this.stroke = { ...r.stroke };
        this.fill = r.fill;
        this.bounding_rect = r.bounding_rect && { ...r.bounding_rect };
    }

    public is_inside_rect(_rect: { pos: vec2; dims: vec2 }): boolean {
        const { pos, dims } = _rect;

        return (
            pos[0] <= this.pos[0] - this.radius &&
            pos[0] + dims[0] >= this.pos[0] + this.radius &&
            pos[1] <= this.pos[1] - this.radius &&
            pos[1] + dims[1] >= this.pos[1] + this.radius
        );
    }
    public displace_by(_displacement: vec2): void {
        const [x, y] = _displacement;

        this.pos[0] += x;
        this.pos[1] += y;

        if (this.bounding_rect) {
            this.bounding_rect.top_left[0] += x;
            this.bounding_rect.bottom_right[0] += x;
            this.bounding_rect.top_left[1] += y;
            this.bounding_rect.bottom_right[1] += y;
        }
    }

    public fix_maths(): void {
        this.bounding_rect = {
            top_left: [this.pos[0] - this.radius, this.pos[1] - this.radius],
            bottom_right: [
                this.pos[0] + this.radius,
                this.pos[1] + this.radius,
            ],
        };
    }

    public resize_by(_delta_xy: vec2): void {
        if (!this.bounding_rect) return;

        
        let sum = _delta_xy[0] + _delta_xy[1];
        if(this.resize_handle === 'n' || this.resize_handle === 'nw' ||  this.resize_handle === 'w') sum = -sum;

        if (sum + this.radius < 10) return;

        this.radius += sum;

        this.fix_maths();
    }
}
