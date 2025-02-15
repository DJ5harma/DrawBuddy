import { CanvasManager } from "./CanvasManager";
import { Shape } from "../Shapes/Shape";

let undo_stack: Shape[] = [];

export class UndoManager {
    public static init() {
        console.log(this.name);

        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey) {
                if (e.key.toUpperCase() === "Z") this.undo();
                else if (e.key.toUpperCase() === "Y") this.redo();
            }
        });
    }

    public static undo() {
        const last_shape = CanvasManager.pop_shape();
        if (!last_shape) return;

        undo_stack.push(last_shape);

        CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
    }

    public static redo() {
        const last_undid_shape = undo_stack.pop();

        if (!last_undid_shape) return;

        CanvasManager.store_shape(last_undid_shape).render_shape(
            last_undid_shape
        );
    }
}
