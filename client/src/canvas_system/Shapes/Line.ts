import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";
import { Shape } from "./Shape";

export class Line implements Shape {
    stroke = ToolPallete.stroke;

    start: vec2 = [0, 0];
    end: vec2 = [0, 0];

    resize_handle: ResizeHandle | undefined;

    public prepare_for_render(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.stroke.color;
        ctx.lineWidth = this.stroke.width;
    }

    public get_bounding_rect(): BoundingRect {
        const min_x = Math.min(this.start[0], this.end[0]);
        const min_y = Math.min(this.start[1], this.end[1]);

        const max_x = Math.max(this.start[0], this.end[0]);
        const max_y = Math.max(this.start[1], this.end[1]);

        return {
            top_left: [min_x, min_y],
            bottom_right: [max_x, max_y],
        };
    }

    // public render_me_whole(ctx: CanvasRenderingContext2D): void {
    //     this.prepare_for_render(ctx);

    //     ctx.beginPath();
    //     ctx.moveTo(...this.start);
    //     ctx.lineTo(...this.end);
    //     ctx.stroke();
    //     ctx.closePath();
    // }

    // public get_copy() {
    //     const copy = new Line();
    //     copy.make_like(this);
    //     return copy;
    // }

    // public make_like(r: Line) {
    //     this.start = [...r.start] as vec2;
    //     this.end = [...r.end] as vec2;
    //     this.stroke = { ...r.stroke };
    //     this.bounding_rect = r.bounding_rect && { ...r.bounding_rect };
    // }

    // public is_inside_rect(_rect: { pos: vec2; dims: vec2 }): boolean {
    //     const { pos, dims } = _rect;

    //     return (
    //         pos[0] < this.start[0] &&
    //         pos[1] < this.start[1] &&
    //         pos[0] + dims[0] > this.start[0] + this.end[0] &&
    //         pos[1] + dims[1] > this.start[1] + this.end[1]
    //     );
    // }

    // public displace_by(_displacement: vec2): void {
    //     const [x, y] = _displacement;

    //     this.start[0] += x;
    //     this.start[1] += y;

    //     this.end[0] += x;
    //     this.end[1] += y;

    //     if (this.bounding_rect) {
    //         this.bounding_rect.top_left[0] += x;
    //         this.bounding_rect.bottom_right[0] += x;
    //         this.bounding_rect.top_left[1] += y;
    //         this.bounding_rect.bottom_right[1] += y;
    //     }
    // }

    // public resize_by(_delta_xy: vec2): void {
    //     const str = this.resize_handle;
    //     if (!str || !this.bounding_rect) return;

    //     const [x, y] = _delta_xy;

    //     for (let i = 0; i < str.length; ++i) {
    //         switch (str[i]) {
    //             case "e": {
    //                 this.end[0] += x;
    //                 this.bounding_rect.bottom_right[0] += x;
    //                 break;
    //             }
    //             case "s": {
    //                 this.end[1] += y;
    //                 this.bounding_rect.bottom_right[1] += y;
    //                 break;
    //             }
    //             case "w": {
    //                 this.start[0] += x;
    //                 this.bounding_rect.top_left[0] += x;
    //                 break;
    //             }
    //             case "n": {
    //                 this.start[1] += y;
    //                 this.bounding_rect.top_left[1] += y;
    //                 break;
    //             }
    //         }
    //     }
    // }

    // public zoom_by(_d: number): void {
    //     // if (this.end[0] - this.start[0] - _d < 10) return;
    //     // if (this.end[1] - this.start[1] - _d < 10) return;

    //     // this.start[0] -= _d;
    //     // this.start[1] -= _d;
    //     this.end[0] -= Math.abs(_d);
    //     this.end[1] -= Math.abs(_d);

    //     this.fix_maths();

    //     return;
    // }
}
