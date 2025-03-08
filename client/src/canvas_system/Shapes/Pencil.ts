import { buffer_ctx } from "../../main";
import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";
import { Shape } from "./Shape";

export class Pencil implements Shape {
    stroke: Stroke = ToolPallete.stroke;

    cached_image_data?: { img: ImageData; sx: number; sy: number };

    bounding_rect: BoundingRect | undefined;
    resize_handle: ResizeHandle | undefined;

    public prepare_for_render(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.stroke.color;
        ctx.lineWidth = this.stroke.width;
    }

    public render_me_whole(ctx: CanvasRenderingContext2D): void {
        if (!this.cached_image_data) {
            console.error(
                "A pencil drawing was requested but its cached image data was not found"
            );
            return;
        }

        buffer_ctx.putImageData(this.cached_image_data.img, 0, 0);

        ctx.beginPath();

        // Now draw it without erasing existing content
        ctx.drawImage(
            buffer_ctx.canvas,
            this.cached_image_data.sx,
            this.cached_image_data.sy
        );

        buffer_ctx.clearRect(
            0,
            0,
            buffer_ctx.canvas.width,
            buffer_ctx.canvas.height
        );

        ctx.closePath();
    }

    // public get_copy() {
    //     const copy = new Pencil();
    //     copy.make_like(this);
    //     return copy;
    // }

    // public make_like(p: Pencil) {
    //     this.stroke = { ...p.stroke };
    //     this.cached_image_data = p.cached_image_data
    //         ? { ...p.cached_image_data }
    //         : undefined;
    //     this.bounding_rect = p.bounding_rect
    //         ? { ...p.bounding_rect }
    //         : undefined;
    // }

    // public is_inside_rect(_rect: { pos: vec2; dims: vec2 }): boolean {
    //     if (!this.bounding_rect) {
    //         console.error("Bounding rect not found");
    //         return false;
    //     }
    //     const dims = _rect.dims;
    //     const pos = _rect.pos;

    //     return (
    //         pos[0] < this.bounding_rect.top_left[0] &&
    //         pos[1] < this.bounding_rect.top_left[1] &&
    //         pos[0] + dims[0] > this.bounding_rect.bottom_right[0] &&
    //         pos[1] + dims[1] > this.bounding_rect.bottom_right[1]
    //     );
    // }

    // public displace_by(_displacement: vec2): void {
    //     const [x, y] = _displacement;

    //     if (this.bounding_rect) {
    //         this.bounding_rect.top_left[0] += x;
    //         this.bounding_rect.bottom_right[0] += x;
    //         this.bounding_rect.top_left[1] += y;
    //         this.bounding_rect.bottom_right[1] += y;
    //     }

    //     if (this.cached_image_data) {
    //         this.cached_image_data.sx += x;
    //         this.cached_image_data.sy += y;
    //     }
    // }

    public get_bounding_rect(): BoundingRect {
        if (!this.cached_image_data) {
            console.error("no cached image data");
            return { bottom_right: [0, 0], top_left: [0, 0] };
        }

        return {
            top_left: [this.cached_image_data.sx, this.cached_image_data.sy],
            bottom_right: [
                this.cached_image_data.sx + this.cached_image_data.img.width,
                this.cached_image_data.sy + this.cached_image_data.img.height,
            ],
        };
    }

    public resize_by(_delta_xy: vec2): void {
        const str = this.resize_handle;
        if (!this.bounding_rect) {
            console.error("BR not found");
            return;
        }
        if (!this.cached_image_data) {
            console.error("Cached image data not found while resizing");
            return;
        }

        if (!str) {
            console.error("Resize handle not found");
            return;
        }

        const [x, y] = _delta_xy;

        // for (let i = 0; i < str.length; ++i) {
        //     switch (str[i]) {
        //         case "e": {
        //             this.cached_image_data.img.width += x;
        //             this.bounding_rect.bottom_right[0] += x;
        //             break;
        //         }
        //         case "s": {
        //             this.dims[1] += y;
        //             this.bounding_rect.bottom_right[1] += y;
        //             break;
        //         }
        //         case "w": {
        //             this.dims[0] -= x;
        //             this.bounding_rect.top_left[0] += x;
        //             this.pos[0] += x;

        //             break;
        //         }
        //         case "n": {
        //             this.dims[1] -= y;
        //             this.bounding_rect.top_left[1] += y;
        //             this.pos[1] += y;
        //             break;
        //         }
        //     }
        // }
    }
    public zoom_by(_d: number): void {
        return;
    }
}
