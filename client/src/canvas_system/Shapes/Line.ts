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

    public render_me_whole(ctx: CanvasRenderingContext2D): void {
        this.prepare_for_render(ctx);

        ctx.beginPath();
        ctx.moveTo(...this.start);
        ctx.lineTo(...this.end);
        ctx.stroke();
        ctx.closePath();
    }
}
