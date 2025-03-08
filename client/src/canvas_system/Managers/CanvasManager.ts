import {
    buffer_canvas,
    buffer_ctx,
    canvas,
    ctx,
    temp_canvas,
    temp_ctx,
} from "../../main";
import { Shape } from "../Shapes/Shape";
import { TempCanvasManager } from "./TempCanvasManager";

// only knows about real ctx

export class CanvasManager {
    private static arr: ImageDataObj[] = [];

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
                temp_canvas.width,
                temp_canvas.height
            ),
            sx: 0,
            sy: 0,
            bounding_rect: shape.get_bounding_rect(),
        } as ImageDataObj;
        this.arr.push(newShape);
        this.render_shape(newShape);
        TempCanvasManager.clear_canvas_only_unrender();
    }

    public static pop_shape() {
        return this.arr.pop();
    }

    public static render_shape(Shape: ImageDataObj) {
        buffer_ctx.putImageData(Shape.img, 0, 0);
        ctx.drawImage(buffer_canvas, Shape.sx, Shape.sy);
        console.log("Put shape", Shape.img);

        return this;
    }

    public static render_stored_shapes_all() {
        this.arr.forEach((Shape) => buffer_ctx.putImageData(Shape.img, 0, 0));
        ctx.drawImage(buffer_canvas, 0, 0);
        return this;
    }

    public static clear_canvas_only_unrender() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return this;
    }

    public static clear_canvas_fully() {
        this.clear_canvas_only_unrender();
        this.arr = [];
        return this;
    }
}
