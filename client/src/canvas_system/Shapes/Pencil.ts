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
}
