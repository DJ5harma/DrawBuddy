import { canvas, ctx } from "../../main";
import { ToolSelector } from "../../ui_system/Tools/ToolSelector/ToolSelector";
import { RectangleSelectionMaker } from "../Makers/RectangleSelectionMaker";
import { Shape } from "../Shapes/Shape";
import { CanvasManager } from "./CanvasManager";
import { SelectionManager } from "./SelectionManager";
import { TempCanvasManager } from "./TempCanvasManager";

let move = false;
let move_start_pos: vec2 = [0, 0];
let resizing = false;

let is_active = false;

export class SelectionDragManager {
    public static init() {
        document.addEventListener("keydown", (e) => this.keydown(e));
        document.addEventListener("keyup", (e) => this.keyup(e));
        console.log("Selection drag manager, init");
        document.addEventListener("mousedown", this.mousedown);
        document.addEventListener("mousemove", this.mousemove);
        document.addEventListener("mouseup", this.mouseup);
    }
    protected static keydown(e: KeyboardEvent): void {
        if (!e.ctrlKey) return;
        is_active = true;
    }
    protected static keyup(_: KeyboardEvent): void {
        is_active = false;
    }
    public static is_dragging() {
        return is_active;
    }

    private static mousedown(e: MouseEvent) {
        if (
            e.button !== 0 ||
            !is_active ||
            ToolSelector.selected_tool !== "SELECTION"
        )
            return;
        move = true;
        move_start_pos = [e.clientX, e.clientY];
        console.log("Started drag");

        CanvasManager.clear_canvas_only_unrender();

        // const x = e.clientX - canvas.getBoundingClientRect().left;
        // const y = e.clientY - canvas.getBoundingClientRect().top;

        // selected_shapes.forEach((shape) => {
        //     if (shape.bounding_rect) {
        //         let left = shape.bounding_rect.top_left[0] + 10;
        //         let top = shape.bounding_rect.top_left[1] + 10;
        //         let right = shape.bounding_rect.bottom_right[0] - 10;
        //         let bottom = shape.bounding_rect.bottom_right[1] - 10;

        //         if (x >= left && x <= right && y >= top && y <= bottom) {
        //             move = true;
        //         } else if (
        //             x >= left - 10 &&
        //             x <= right + 10 &&
        //             y >= top - 10 &&
        //             y <= bottom + 10
        //         ) {
        //             // resizing = true;
        //             // shape.start_interaction([x, y]);
        //         }
        //     }
        // });
    }
    private static mousemove(e: MouseEvent) {
        if (!move) return;

        const new_pos: vec2 = [e.clientX, e.clientY];

        const selected_shapes = SelectionManager.get_selected_shapes();

        console.log("Shapes selected: ", selected_shapes.size);

        CanvasManager.clear_canvas_only_unrender();

        selected_shapes.forEach((shape) => {
            const delta: vec2 = [
                new_pos[0] - move_start_pos[0],
                new_pos[1] - move_start_pos[1],
            ];

            shape.displace_by(delta);
            move_start_pos = new_pos;
        });
        CanvasManager.render_stored_shapes_all();
    }
    private static mouseup(): void {
        if (!move) return;

        move = false;

        document.body.style.cursor = "default";
        SelectionManager.unrender_selection_of_all().render_selection_of_all();
    }

    // public static is_dragging_selection() {
    //     return move;
    // }
}
