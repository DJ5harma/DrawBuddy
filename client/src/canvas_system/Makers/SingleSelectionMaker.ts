import { canvas } from "../../main";
import { CanvasManager } from "../Managers/CanvasManager";
import { SelectionManager } from "../Managers/SelectionManager";
import { Shape } from "../Shapes/Shape";

export class SingleSelectionMaker {
    private static allow_selection = false;
    public static curr_Shape: Shape | undefined = undefined;

    // public move_start_pos: vec2 = [0, 0];
    // public resizing = false;

    static init() {
        console.log("SingleSelectionMaker init");

        document.addEventListener("click", (e) => {
            if (!SingleSelectionMaker.allow_selection) return;

            const shapes = CanvasManager.get_shapes();

            const [x, y] = [
                e.clientX - canvas.getBoundingClientRect().left,
                e.clientY - canvas.getBoundingClientRect().left,
            ];

            for (let i = shapes.length - 1; i != -1; --i) {
                const { bounding_rect } = shapes[i];
                if (!bounding_rect) {
                    console.error(
                        "Bounding rect of",
                        shapes[i],
                        "is undefined"
                    );
                    return;
                }
                const { top_left, bottom_right } = bounding_rect;

                if (
                    x > top_left[0] - 10 &&
                    x < bottom_right[0] + 10 &&
                    y > top_left[1] - 10 &&
                    y < bottom_right[1] + 10
                ) {
                    this.curr_Shape = shapes[i];
                    SelectionManager.add_shape_to_selection(shapes[i]);
                    // const selectionManager = new SingleSelectionMaker();
                    // selectionManager.enableSelection();
                    break;
                }
            }
        });
    }

    static start() {
        this.allow_selection = true;
    }

    static stop() {
        this.allow_selection = false;
    }
}
