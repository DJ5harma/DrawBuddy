import { Shape } from "./Shape";

export class Rectangle implements Shape {
    pos;
    dims;
    stroke;
    fill;

    bounding_rect: BoundingRect | undefined;
    resize_handle: ResizeHandle | undefined;

    constructor({
        pos,
        dims,
        stroke,
        fill,
    }: {
        pos: vec2;
        dims: vec2;
        stroke: Stroke;
        fill: Color;
    }) {
        this.pos = pos;
        this.dims = dims;
        this.stroke = stroke;
        this.fill = fill;
    }

    public prepare_for_render(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.stroke.color;
        ctx.lineWidth = this.stroke.width;
    }

    public render_me_whole(ctx: CanvasRenderingContext2D): void {
        this.prepare_for_render(ctx);

        ctx.beginPath();
        ctx.strokeRect(...this.pos, ...this.dims);
        ctx.fillStyle = this.fill;
        ctx.fillRect(...this.pos, ...this.dims);
        ctx.closePath();
    }

    public get_copy() {
        const copy = new Rectangle({
            dims: { ...this.dims },
            fill: this.fill,
            pos: { ...this.pos },
            stroke: { ...this.stroke },
        });
        copy.make_like(this);
        return copy;
    }

    public make_like(r: Rectangle) {
        this.pos = [...r.pos] as vec2;
        this.dims = [...r.dims] as vec2;
        this.stroke = { ...r.stroke };
        this.fill = r.fill;
        this.bounding_rect = r.bounding_rect && { ...r.bounding_rect };
    }

    public is_inside_rect(_rect: { pos: vec2; dims: vec2 }): boolean {
        const { pos, dims } = _rect;

        return (
            pos[0] < this.pos[0] &&
            pos[1] < this.pos[1] &&
            pos[0] + dims[0] > this.pos[0] + this.dims[0] &&
            pos[1] + dims[1] > this.pos[1] + this.dims[1]
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
        let [x, y] = this.pos;
        let [w, l] = this.dims;

        if (w < 0) {
            w = -w;
            x -= w;
        }
        if (l < 0) {
            l = -l;
            y -= l;
        }

        this.pos = [x, y] as vec2;
        this.dims = [w, l] as vec2;

        this.bounding_rect = {
            top_left: [this.pos[0], this.pos[1]],
            bottom_right: [
                this.pos[0] + this.dims[0],
                this.pos[1] + this.dims[1],
            ],
        };
    }

    public resize_by(delta_xy: vec2) {
        const [x, y] = delta_xy;

        const str = this.resize_handle;

        if (!this.bounding_rect) {
            console.error("BR not found");
            return;
        }

        if (!str) {
            console.error("Resize handle not found");
            return;
        }

        for (let i = 0; i < str.length; ++i) {
            switch (str[i]) {
                case "e": {
                    this.dims[0] += x;
                    this.bounding_rect.bottom_right[0] += x;
                    break;
                }
                case "s": {
                    this.dims[1] += y;
                    this.bounding_rect.bottom_right[1] += y;
                    break;
                }
                case "w": {
                    this.dims[0] -= x;
                    this.bounding_rect.top_left[0] += x;
                    this.pos[0] += x;

                    break;
                }
                case "n": {
                    this.dims[1] -= y;
                    this.bounding_rect.top_left[1] += y;
                    this.pos[1] += y;
                    break;
                }
            }
        }
    }
}
