import { canvas, ctx } from "../../main";
import { ToolSelector } from "../../ui_system/Tools/ToolSelector/ToolSelector";
import { CanvasManager } from "./CanvasManager";
import { SelectionManager } from "./SelectionManager";
import { TempCanvasManager } from "./TempCanvasManager";

let move = false;
let move_start_pos: vec2 = [0, 0];
let resizing = false;

export class SelectionDragManager {
    public static init() {
        console.log("Selection drag manager, init");
        document.addEventListener("mousedown", this.mousedown);
        document.addEventListener("mousemove", this.mousemove);
        document.addEventListener("mouseup", this.mouseup);
    }

    private static mousedown(e: MouseEvent) {
        if (e.button !== 0 || ToolSelector.selected_tool !== "SELECTION")
            return;
        console.log("Started drag");

        const selected_shapes = SelectionManager.get_selected_shapes();
        if (!selected_shapes.size) return;

        const x = e.clientX - canvas.getBoundingClientRect().left;
        const y = e.clientY - canvas.getBoundingClientRect().top;

        selected_shapes.forEach((shape) => {
            if (shape.bounding_rect) {
                let left = shape.bounding_rect.top_left[0] + 10;
                let top = shape.bounding_rect.top_left[1] + 10;
                let right = shape.bounding_rect.bottom_right[0] - 10;
                let bottom = shape.bounding_rect.bottom_right[1] - 10;

                if (x >= left && x <= right && y >= top && y <= bottom) {
                    document.body.style.cursor = "grab";
                    move = true;
                    move_start_pos = [e.clientX, e.clientY];
                } else if (
                    x >= left - 10 &&
                    x <= right + 10 &&
                    y >= top - 10 &&
                    y <= bottom + 10
                ) {
                    resizing = true;
                    shape.start_interaction([x, y]);
                }
            }
        });
    }
    private static mousemove(e: MouseEvent) {
        SelectionManager.get_selected_shapes().forEach((shape) => {
            if (resizing) shape.start_resizing_shapes([e.clientX, e.clientY]);

            if (move) {
                const rect = canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;

                const delta: vec2 = [
                    currentX - move_start_pos[0],
                    currentY - move_start_pos[1],
                ];

                if (shape) {
                    shape.displace_by(delta);

                    move_start_pos = [currentX, currentY];
                }
                TempCanvasManager.clear_canvas_only_unrender().render_shape(
                    shape
                );
            }
        });
    }
    private static mouseup(): void {
        if (!move) return;

        move = false;

        document.body.style.cursor = "default";

        TempCanvasManager.clear_canvas_only_unrender();

        CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
        ctx.closePath();
    }

    public static is_dragging_selection() {
        return move;
    }
}
