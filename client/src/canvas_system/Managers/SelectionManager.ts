import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";
import { Rectangle } from "../Shapes/Rectangle";
import { Shape } from "../Shapes/Shape";
import { CanvasManager } from "./CanvasManager";
import { TempCanvasManager } from "./TempCanvasManager";

export class SelectionManager {
    // private static selecting = false;

    private static selected_shapes = new Set<Shape>();

    public static init() {
        console.log(this.name);
    }

    public static add_shape_to_selection(shape: Shape) {
        console.log(shape, "added to selection list");
        if (this.selected_shapes.has(shape)) return;
        this.selected_shapes.add(shape);
        this.render_selection_of_shape(shape);
        return this;
    }

    public static remove_selection_of_all() {
        TempCanvasManager.clear_canvas_only_unrender();
        this.selected_shapes.clear();
        return this;
    }

    public static unrender_selection_of_all() {
        TempCanvasManager.clear_canvas_only_unrender();
        return this;
    }

    private static render_selection_of_shape(shape: Shape) {
        if (!shape.bounding_rect) {
            console.error("Shape has no bounding_rect: ", shape);
            return;
        }

        const { top_left, bottom_right } = shape.bounding_rect;

        const rect = new Rectangle({
            pos: [top_left[0] - 10, top_left[1] - 10],
            dims: [
                bottom_right[0] - top_left[0] + 20,
                bottom_right[1] - top_left[1] + 20,
            ],
            fill: "rgba(100, 100, 242, 0.1)",
            stroke: { color: "rgba(100, 100, 242, 1)", width: 2 },
        });

        TempCanvasManager.render_shape(rect);
    }
    public static render_selection_of_all() {
        // TempCanvasManager.clear_canvas_only_unrender();
        this.selected_shapes.forEach((shape) => {
            this.render_selection_of_shape(shape);
        });

        return this;
    }

    // public static is_selecting() {
    //     return this.selecting;
    // }

    public static is_shape_selected(shape: Shape) {
        return this.selected_shapes.has(shape);
    }

    public static get_selected_shapes() {
        return this.selected_shapes;
    }

    public static update_selected_shapes_from_pallete() {
        console.log(this.selected_shapes, " selected");

        if (!this.selected_shapes.size) return;

        this.selected_shapes.forEach((shape) => {
            if (shape.fill) {
                console.log("prev fill: ", shape.fill);
                shape.fill = ToolPallete.fill;
                console.log("new fill: ", shape.fill);
            }
            if (shape.stroke) {
                console.log("prev stroke: ", shape.stroke);
                shape.stroke = { ...ToolPallete.stroke };
                console.log("new stroke: ", shape.stroke);
            }
        });
        CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
        this.render_selection_of_all();
    }

    public static is_cursor_on_shape(shape: Shape, e: MouseEvent) {
        if (!shape.bounding_rect) {
            console.error("Shape doesn't have bounding rect: ", shape);
            return;
        }
        const { top_left, bottom_right } = shape.bounding_rect;
        const [x, y] = [e.clientX, e.clientY];
        return (
            x > top_left[0] &&
            x < bottom_right[0] &&
            y > top_left[1] &&
            y < bottom_right[1]
        );
    }
}
