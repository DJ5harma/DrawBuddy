import { buffer_ctx, ctx, temp_ctx } from "../../main";
import { Shape } from "../Shapes/Shape";
import { TempCanvasManager } from "./TempCanvasManager";

// only knows about real ctx

export class CanvasManager {
    private static arr: ImageDataObj[] = [];

    private static displaced: vec2 = [0, 0];

    public static init() {
        console.log(this.name, "init");
    }

    public static get_shapes() {
        return this.arr;
    }

    public static store_shape(shape: Shape) {
        const newShape = {
            img: temp_ctx.getImageData(
                0,
                0,
                temp_ctx.canvas.width,
                temp_ctx.canvas.height
            ),
            sx: -this.displaced[0],
            sy: -this.displaced[1],
            bounding_rect: shape.get_bounding_rect(),
        } as ImageDataObj;
        TempCanvasManager.clear_canvas_only_unrender();

        buffer_ctx.putImageData(newShape.img, 0, 0);
        ctx.drawImage(buffer_ctx.canvas, 0, 0);

        this.arr.push(newShape);
    }

    public static displace_canvas_by(_displacement: vec2) {
        const [dx, dy] = _displacement;
        this.displaced[0] += dx;
        this.displaced[1] += dy;

        CanvasManager.clear_canvas_only_unrender();
        this.arr.forEach(({ img, sx, sy }) => {
            buffer_ctx.putImageData(img, 0, 0);
            ctx.drawImage(
                buffer_ctx.canvas,
                this.displaced[0] + sx,
                this.displaced[1] + sy
            );
        });
    }

    public static render_shape(Shape: ImageDataObj) {
        buffer_ctx.putImageData(Shape.img, 0, 0);
        ctx.drawImage(buffer_ctx.canvas, Shape.sx, Shape.sy);
        console.log("Put shape", Shape.img);

        return this;
    }

    public static render_stored_shapes_all() {
        this.displace_canvas_by([0, 0]);
        return this;
    }

    public static clear_canvas_only_unrender() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return this;
    }

    public static clear_canvas_fully() {
        this.clear_canvas_only_unrender();
        this.arr = [];
        return this;
    }

    public static pop_shape() {
        return this.arr.pop();
    }
}
