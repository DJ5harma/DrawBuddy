import { Shape } from "../Shapes/Shape";
import { CanvasManager } from "./CanvasManager";
import { SelectionDragManager } from "./SelectionDragManager";
import { SelectionManager } from "./SelectionManager";

export class ResizeManager {
    // private static resizing = false;
    private static starting_pos: vec2 = [0, 0];

    private static resizing_shape: Shape | undefined = undefined;

    public static init() {
        console.log("init ResizeManager");

        document.addEventListener("mousedown", (e) => this.mousedown(e));
        document.addEventListener("mousemove", (e) => this.mousemove(e));
        document.addEventListener("mouseup", (e) => this.mouseup(e));
    }

    private static start_interaction(_touch_pos: vec2, shape: Shape): void {
        console.log("setting dir");
        const [x, y] = _touch_pos;

        if (shape.bounding_rect) {
            document.body.style.cursor = "e-resize";
            const left = shape.bounding_rect.top_left[0];
            const right = shape.bounding_rect.bottom_right[0];
            const top = shape.bounding_rect.top_left[1];
            const bottom = shape.bounding_rect.bottom_right[1];
            if (x - left <= 10 && y - top <= 10) {
                shape.resize_handle = "nw";
            } else if (x - left <= 10 && bottom - y <= 10) {
                shape.resize_handle = "sw";
            } else if (right - x <= 10 && y - top <= 10) {
                shape.resize_handle = "ne";
            } else if (right - x <= 10 && bottom - y <= 10) {
                shape.resize_handle = "se";
            } else if (x - left <= 10) {
                shape.resize_handle = "w";
            } else if (y - top <= 10) {
                shape.resize_handle = "n";
            } else if (right - x <= 10) {
                shape.resize_handle = "e";
            } else if (bottom - y <= 10) {
                shape.resize_handle = "s";
            }
            console.log("setting dir to :", shape.resize_handle);
        }
    }

    private static mousedown(e: MouseEvent) {
        if (SelectionDragManager.is_dragging()) return;

        const selected_shapes = [...SelectionManager.get_selected_shapes()];

        // if(selected_shapes.length > 1) return; // If we desire selection to restrict to one only

        const [x, y] = [e.clientX, e.clientY];
        const abs = Math.abs;

        for (let i = selected_shapes.length - 1; i != -1; --i) {
            const shape = selected_shapes[i];

            if (!shape.bounding_rect) return;

            const { top_left, bottom_right } = shape.bounding_rect;

            const diffs = [
                abs(top_left[0] - x), // left
                abs(bottom_right[0] - x), // right
                abs(top_left[1] - y), // top
                abs(bottom_right[1] - y), // bottom
            ];

            diffs.forEach((d) => {
                if (d < 10) {
                    ResizeManager.start_interaction([x, y], shape);
                    this.resizing_shape = shape;
                    this.starting_pos = [x, y];
                    return;
                }
            });
        }
    }

    private static mousemove(e: MouseEvent) {
        if (!this.resizing_shape) return;

        this.resizing_shape.resize_by([
            e.clientX - this.starting_pos[0],
            e.clientY - this.starting_pos[1],
        ]);
        this.starting_pos = [e.clientX, e.clientY];
        SelectionManager.unrender_selection_of_all().render_selection_of_all();
        CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
    }

    private static mouseup(_: MouseEvent) {
        if (!this.resizing_shape) return;
        this.resizing_shape.fix_maths();
        this.resizing_shape = undefined;

        document.body.style.cursor = "default";
    }
}
