import { ToolSelector } from "../../ui_system/Tools/ToolSelector/ToolSelector";
import { CanvasManager } from "./CanvasManager";
import { SelectionManager } from "./SelectionManager";

let move = false;
let move_start_pos: vec2 = [0, 0];

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
        move = false;
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
    }

    private static mousemove(e: MouseEvent) {
        if (!move) return;

        const new_pos: vec2 = [e.clientX, e.clientY];
        const delta: vec2 = [
            new_pos[0] - move_start_pos[0],
            new_pos[1] - move_start_pos[1],
        ];

        const selected_shapes = SelectionManager.get_selected_shapes();

        console.log("Shapes selected: ", selected_shapes.size);

        CanvasManager.clear_canvas_only_unrender();

        selected_shapes.forEach((shape) => {
            shape.displace_by(delta);
        });
        SelectionManager.unrender_selection_of_all().render_selection_of_all();
        CanvasManager.render_stored_shapes_all();

        move_start_pos = new_pos;
    }
    private static mouseup(): void {
        if (!move) return;

        move = false;

        document.body.style.cursor = "default";
        SelectionManager.unrender_selection_of_all().render_selection_of_all();
        CanvasManager.render_stored_shapes_all();
    }
}
