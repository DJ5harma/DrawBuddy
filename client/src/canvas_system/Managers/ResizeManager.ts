import { Shape } from "../Shapes/Shape";
import { SelectionManager } from "./SelectionManager";

export class ResizeManager {
    static resizing = false;

    public static init() {
        console.log("init ResizeManager");

        document.addEventListener("mousedown", (e) => this.mousedown(e));
    }

    private static mousedown(e: MouseEvent) {
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

            diffs.forEach(d => {
                if(d < 10){
                    this.resizing = true;
                    Shape.start_interaction([x, y],shape);
                    return;
                } 
            })
        }
    }
}
