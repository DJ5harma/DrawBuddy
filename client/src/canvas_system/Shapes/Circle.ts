import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";
import { Shape } from "./Shape";

export class Circle implements Shape {
    stroke = ToolPallete.stroke;
    fill = ToolPallete.fill;

    pos = [0, 0];
    radius = 0;

    resize_handle: ResizeHandle | undefined;

    public prepare_for_render(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.stroke.color;
        ctx.lineWidth = this.stroke.width;
    }

    public get_bounding_rect(): BoundingRect {
        return {
            top_left: [this.pos[0] - this.radius, this.pos[1] - this.radius],
            bottom_right: [
                this.pos[0] + this.radius,
                this.pos[1] + this.radius,
            ],
        };
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
}
