import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";
import { Shape } from "./Shape";

export class Rectangle implements Shape {
    pos: vec2 = [0, 0];
    dims: vec2 = [0, 0];
    stroke = ToolPallete.stroke;
    fill = ToolPallete.fill;

    bounding_rect: BoundingRect | undefined;
    resize_handle: ResizeHandle | undefined;

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

    public get_bounding_rect(): BoundingRect {
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

        return {
            top_left: [this.pos[0], this.pos[1]],
            bottom_right: [
                this.pos[0] + this.dims[0],
                this.pos[1] + this.dims[1],
            ],
        };
    }

    // public resize_by(delta_xy: vec2) {
    //     const [x, y] = delta_xy;

    //     const str = this.resize_handle;

    //     if (!this.bounding_rect) {
    //         console.error("BR not found");
    //         return;
    //     }

    //     if (!str) {
    //         console.error("Resize handle not found");
    //         return;
    //     }

    //     for (let i = 0; i < str.length; ++i) {
    //         switch (str[i]) {
    //             case "e": {
    //                 this.dims[0] += x;
    //                 this.bounding_rect.bottom_right[0] += x;
    //                 break;
    //             }
    //             case "s": {
    //                 this.dims[1] += y;
    //                 this.bounding_rect.bottom_right[1] += y;
    //                 break;
    //             }
    //             case "w": {
    //                 this.dims[0] -= x;
    //                 this.bounding_rect.top_left[0] += x;
    //                 this.pos[0] += x;

    //                 break;
    //             }
    //             case "n": {
    //                 this.dims[1] -= y;
    //                 this.bounding_rect.top_left[1] += y;
    //                 this.pos[1] += y;
    //                 break;
    //             }
    //         }
    //     }
    // }
}
