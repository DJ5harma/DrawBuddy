import { SelectionMaker } from "../Makers/SelectionMaker";
import { Rectangle } from "../Shapes/Rectangle";
import { TempCanvasManager } from "./TempCanvasManager";

let selected_shapes = new Set<ImageDataObj>();

export class SelectionManager {
    public static init() {
        console.log(this.name);
    }

    public static add_shape_to_selection(shape: ImageDataObj) {
        console.log(shape, "added to selection list");
        if (selected_shapes.has(shape)) return this;
        selected_shapes.add(shape);
        this.render_selection_of_shape(shape);
        return this;
    }

    public static remove_selection_of_all() {
        TempCanvasManager.clear_canvas_only_unrender();
        selected_shapes.clear();
        return this;
    }

    public static unrender_selection_of_all() {
        TempCanvasManager.clear_canvas_only_unrender();
        return this;
    }

    private static render_selection_of_shape({
        bounding_rect,
        sx,
        sy,
    }: ImageDataObj) {
        const { top_left, bottom_right } = bounding_rect;

        const rect = new Rectangle();
        rect.pos = [top_left[0] - 10 + sx, top_left[1] - 10 + sy];
        rect.dims = [
            bottom_right[0] - top_left[0] + 20,
            bottom_right[1] - top_left[1] + 20,
        ];
        rect.fill = SelectionMaker.curr.fill;
        rect.stroke = SelectionMaker.curr.stroke;

        TempCanvasManager.render_shape(rect);
    }

    public static render_selection_of_all() {
        selected_shapes.forEach((shape) => {
            this.render_selection_of_shape(shape);
        });

        return this;
    }

    public static is_shape_selected(shape: ImageDataObj) {
        return selected_shapes.has(shape);
    }

    public static get_selected_shapes() {
        return selected_shapes;
    }

    // public static update_selected_shapes_from_pallete() {
    //     console.log(selected_shapes.size, " selected");

    //     if (!selected_shapes.size) return;

    //     selected_shapes.forEach((shape) => {
    //         if (shape.fill) {
    //             console.log("prev fill: ", shape.fill);
    //             shape.fill = ToolPallete.fill;
    //             console.log("new fill: ", shape.fill);
    //         }
    //         if (shape.stroke) {
    //             console.log("prev stroke: ", shape.stroke);
    //             shape.stroke = { ...ToolPallete.stroke };
    //             console.log("new stroke: ", shape.stroke);
    //         }
    //     });
    //     CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
    //     this.render_selection_of_all();
    // }

    public static is_cursor_on_shape(
        bounding_rect: BoundingRect,
        e: MouseEvent
    ) {
        const { top_left, bottom_right } = bounding_rect;
        const [x, y] = [e.clientX, e.clientY];
        return (
            x >
                // + 30
                top_left[0] &&
            x <
                // - 30
                bottom_right[0] &&
            y >
                // 30 +
                top_left[1] &&
            y <
                // - 30 +
                bottom_right[1]
        );
    }

    public static is_shape_inside_rect(
        bounding_rect: BoundingRect,
        { pos, dims }: { pos: vec2; dims: vec2 }
    ) {
        return (
            pos[0] < bounding_rect.top_left[0] &&
            pos[1] < bounding_rect.top_left[1] &&
            pos[0] + dims[0] > bounding_rect.bottom_right[0] &&
            pos[1] + dims[1] > bounding_rect.bottom_right[1]
        );
    }
}
