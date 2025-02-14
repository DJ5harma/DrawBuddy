import { Shape } from "../Shapes/Shape";
import { SelectionManager } from "./SelectionManager";

export class ResizeManager {
    static resizing = false;

    public static init() {
        console.log("init ResizeManager");

        document.addEventListener("mousedown", (e) => this.mousedown(e));
    }

    public static start_interaction(_touch_pos:vec2, shape: Shape): void {
        console.log("setting dir");
        const [x, y] = _touch_pos;


        if (shape.bounding_rect) {
            
            const left = shape.bounding_rect.top_left[0];
            const right = shape.bounding_rect.bottom_right[0];
            const top = shape.bounding_rect.top_left[1];
            const bottom = shape.bounding_rect.bottom_right[1];
            if(x - left <= 10 && y - top <= 10){
                shape.resize_handle = 'nw'
            }
            else if(x - left <= 10 && bottom - y <= 10){
                shape.resize_handle = 'sw'
            }
            else if(right - x <= 10 && y - top <= 10){
                shape.resize_handle = 'ne'
            }
            else if(right - x <= 10 && bottom - y <= 10){
                shape.resize_handle = 'sw'
            }
            else if(x - left <= 10){
                shape.resize_handle = 'w'
            }
            else if(y - top <= 10){
                shape.resize_handle = 'n'
            }
            else if(right - x <= 10){
                shape.resize_handle = 'e'
            }
            else if(bottom - y <= 10){
                shape.resize_handle = 's'
            }
            console.log("setting dir to :" , shape.resize_handle);
        }
    };

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
                    ResizeManager.start_interaction([x, y],shape);
                    return;
                } 
            })
        }
    }
}
