import { ToolSelector } from "../../ui_system/Tools/ToolSelector/ToolSelector";
import { CanvasManager } from "./CanvasManager";
import { SelectionManager } from "./SelectionManager";

let move = false;
let move_start_pos: vec2 = [0, 0];

let is_active = false;

export class SelectionDragManager {
    public static init() {
        console.log("Selection drag manager, init");

        document.addEventListener("keydown", this.keydown);
        document.addEventListener("keyup", this.keyup);
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
        move = false;
        document.body.style.cursor = "default";
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
        document.body.style.cursor = "grab";
        move = true;
        move_start_pos = [e.clientX, e.clientY];
        console.log("Started drag");
    }

    private static mousemove(e: MouseEvent) {
        if (!move) return;

        console.log("dragging");

        const [dx, dy]: vec2 = [
            e.clientX - move_start_pos[0],
            e.clientY - move_start_pos[1],
        ];
        // console.log(SelectionManager.get_selected_shapes());

        SelectionManager.get_selected_shapes().forEach((shape) => {
            shape.sx += dx;
            shape.sy += dy;
        });
        CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();

        SelectionManager.unrender_selection_of_all().render_selection_of_all();

        move_start_pos = [e.clientX, e.clientY];
    }

    private static mouseup(): void {
        if (!move) return;

        move = false;
    }
}
