import { canvas, ctx } from "../../main";
import { Shape } from "../Shapes/Shape";

// only knows about real ctx
export class CanvasManager {
    private static arr: Shape[] = [];

    public static init() {
        console.log(this.name, "init");
    }

    public static get_shapes() {
        return this.arr;
    }

    public static store_shape(Shape: Shape) {
        Shape.fix_maths();
        this.arr.push(Shape.get_copy());
        return this;
    }

    public static pop_shape() {
        return this.arr.pop();
    }

    public static render_shape(Shape: Shape) {
        Shape.render_me_whole(ctx);
        return this;
    }

    public static render_stored_shapes_all() {
        this.arr.forEach((Shape) => this.render_shape(Shape));
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
