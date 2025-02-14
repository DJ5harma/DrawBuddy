import { canvas, temp_ctx } from "../../main";
import { Maker } from "./Maker";
import { Rectangle } from "../Shapes/Rectangle";
import { SelectionManager } from "../Managers/SelectionManager";
import { TempCanvasManager } from "../Managers/TempCanvasManager";
import { CanvasManager } from "../Managers/CanvasManager";
import { ToolSelector } from "../../ui_system/Tools/ToolSelector/ToolSelector";
import { SelectionDragManager } from "../Managers/SelectionDragManager";

let draw = false;

let curr = new Rectangle({
    pos: [0, 0],
    dims: [0, 0],
    stroke: {
        color: "rgb(5, 247, 255)",
        width: 1,
    },
    fill: "rgba(5, 247, 255, 0.1)",
});

export class RectangleSelectionMaker extends Maker {
    public static init(): void {
        document.addEventListener("mousedown", (e) => this.mousedown(e));
        document.addEventListener("mousemove", (e) => this.mousemove(e));
        document.addEventListener("mouseup", (e) => this.mouseup(e));
    }
    protected static mousedown(e: MouseEvent): void {
        if (
            e.button !== 0 ||
            SelectionDragManager.is_dragging_selection() ||
            ToolSelector.selected_tool !== "SELECTION"
        )
            return;

        draw = true;
        curr.pos = [e.clientX, e.clientY];
        curr.dims = [0, 0];

        curr.prepare_for_render(temp_ctx);
        temp_ctx.beginPath();
        temp_ctx.moveTo(e.clientX, e.clientY);
    }

    protected static mousemove(e: MouseEvent): void {
        console.log(SelectionDragManager.is_dragging_selection());

        if (!draw) return;
        const [x, y] = [e.clientX, e.clientY];

        curr.dims = [x - curr.pos[0], y - curr.pos[1]];

        TempCanvasManager.clear_canvas_only_unrender().render_shape(curr);
    }

    protected static mouseup(e: MouseEvent): void {
        if (e.button !== 0 || !draw) return;
        draw = false;

        let [x, y] = curr.pos;
        let [w, l] = curr.dims;

        if (w < 0) {
            w = -w;
            x -= w;
        }
        if (l < 0) {
            l = -l;
            y -= l;
        }

        SelectionManager.remove_selection_of_all();

        if (w < 40 || l < 40) {
            const shapes = CanvasManager.get_shapes();

            const [x, y] = [
                e.clientX - canvas.getBoundingClientRect().left,
                e.clientY - canvas.getBoundingClientRect().left,
            ];

            for (let i = shapes.length - 1; i > -1; --i) {
                const { bounding_rect } = shapes[i];
                if (!bounding_rect || !shapes[i]) {
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
                    SelectionManager.add_shape_to_selection(shapes[i]);
                    break;
                }
            }
            return;
        }

        TempCanvasManager.clear_canvas_only_unrender();

        SelectionManager.remove_selection_of_all();
        CanvasManager.get_shapes().forEach((shape) => {
            if (
                shape.is_inside_rect({
                    pos: [x - 10, y - 10],
                    dims: [w + 20, l + 20],
                })
            ) {
                SelectionManager.add_shape_to_selection(shape);
            }
        });

        console.log("MOUSE UPPED FROM SELECTION RECT MAKER");
    }
}
