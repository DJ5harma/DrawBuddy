import { CanvasManager } from "./CanvasManager";
import { SelectionDragManager } from "./SelectionDragManager";
import { SelectionManager } from "./SelectionManager";

let starting_pos: vec2 = [0, 0];

let resizing = false;

const shape_to_resize_handle_map = new Map<ImageDataObj, ResizeHandle>();

export class ResizeManager {
    public static init() {
        console.log("init ResizeManager");

        document.addEventListener("mousedown", this.mousedown);
        document.addEventListener("mousemove", this.mousemove);
        document.addEventListener("mouseup", this.mouseup);
    }

    private static get_handle(_touch_pos: vec2, shape: ImageDataObj) {
        console.log("setting dir");
        const [x, y] = _touch_pos;

        let handle: ResizeHandle | undefined = undefined;

        document.body.style.cursor = "e-resize";
        const left = shape.bounding_rect.top_left[0];
        const right = shape.bounding_rect.bottom_right[0];
        const top = shape.bounding_rect.top_left[1];
        const bottom = shape.bounding_rect.bottom_right[1];

        if (x - left <= 10 && y - top <= 10) handle = "nw";
        else if (x - left <= 10 && bottom - y <= 10) handle = "sw";
        else if (right - x <= 10 && y - top <= 10) handle = "ne";
        else if (right - x <= 10 && bottom - y <= 10) handle = "se";
        else if (x - left <= 10) handle = "w";
        else if (y - top <= 10) handle = "n";
        else if (right - x <= 10) handle = "e";
        else if (bottom - y <= 10) handle = "s";

        if (!handle) console.error("handle for shape not found", shape);

        console.log("setting dir to :", handle);

        return handle || "n";
    }

    private static resize_shapes_by(delta: vec2) {
        const [dx, dy] = delta;
        for (const [shape, handle] of shape_to_resize_handle_map) {
            let dl = 0;
            let dr = 0;
            let dn = 0;
            let ds = 0;

            for (let i = 0; i < handle.length; ++i) {
                switch (handle[i]) {
                    case "e": {
                        dr += dx;
                        break;
                    }
                    case "s": {
                        ds += dy;
                        break;
                    }
                    case "w": {
                        dl += dx;
                        break;
                    }
                    case "n": {
                        dn += dy;
                        break;
                    }
                }
            }
            shape.sx += dl;
            shape.sy += dn;

            shape.bounding_rect.top_left[0] += dl;
            shape.bounding_rect.top_left[1] += dn;
            shape.bounding_rect.bottom_right[0] += dr;
            shape.bounding_rect.bottom_right[1] += ds;

            CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
            SelectionManager.unrender_selection_of_all().render_selection_of_all();
        }
    }

    private static mousedown(e: MouseEvent) {
        if (SelectionDragManager.is_dragging()) return;
        const selected_shapes = [...SelectionManager.get_selected_shapes()];

        // if(selected_shapes.length > 1) return; // If we desire selection to restrict to one only

        const [x, y] = [e.clientX, e.clientY];
        const abs = Math.abs;

        for (let i = selected_shapes.length - 1; i != -1; --i) {
            const { sx, sy, bounding_rect } = selected_shapes[i];

            const { top_left, bottom_right } = bounding_rect;

            const diffs = [
                abs(top_left[0] + sx - x), // left
                abs(bottom_right[0] + sx - x), // right
                abs(top_left[1] + sy - y), // top
                abs(bottom_right[1] + sy - y), // bottom
            ];

            diffs.forEach((d) => {
                if (d < 10) {
                    resizing = true;
                    selected_shapes.forEach((shp) => {
                        shape_to_resize_handle_map.set(
                            shp,
                            ResizeManager.get_handle([x, y], shp)
                        );
                    });
                    return;
                }
            });

            starting_pos = [x, y];
        }
    }

    private static mousemove(e: MouseEvent) {
        if (!resizing) return;

        ResizeManager.resize_shapes_by([
            e.clientX - starting_pos[0],
            e.clientY - starting_pos[1],
        ]);

        starting_pos = [e.clientX, e.clientY];

        SelectionManager.unrender_selection_of_all().render_selection_of_all();
        CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
    }

    private static mouseup(_: MouseEvent) {
        resizing = false;

        document.body.style.cursor = "default";
    }
}
