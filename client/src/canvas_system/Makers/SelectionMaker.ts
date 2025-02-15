import { temp_ctx } from "../../main";
import { Maker } from "./Maker";
import { Rectangle } from "../Shapes/Rectangle";
import { SelectionManager } from "../Managers/SelectionManager";
import { TempCanvasManager } from "../Managers/TempCanvasManager";
import { CanvasManager } from "../Managers/CanvasManager";
import { ToolSelector } from "../../ui_system/Tools/ToolSelector/ToolSelector";
import { SelectionDragManager } from "../Managers/SelectionDragManager";
import { Shape } from "../Shapes/Shape";

let draw = false;

const curr = new Rectangle();

export class SelectionMaker extends Maker {
    public static init(): void {
        document.addEventListener("mousedown", (e) => this.mousedown(e));
        document.addEventListener("mousemove", (e) => this.mousemove(e));
        document.addEventListener("mouseup", (e) => this.mouseup(e));
    }

    protected static mousedown(e: MouseEvent): void {
        if (
            e.button !== 0 ||
            SelectionDragManager.is_dragging() ||
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

            let selected_shape: Shape | undefined;

            for (let i = shapes.length - 1; i > -1; --i) {
                if (SelectionManager.is_cursor_on_shape(shapes[i], e)) {
                    selected_shape = shapes[i];
                    break;
                }
            }
            if (!selected_shape) return;
            SelectionManager.add_shape_to_selection(
                selected_shape
            ).render_selection_of_shape(selected_shape);
        }

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

        SelectionManager.render_selection_of_all();

        console.log("MOUSE UPPED FROM SELECTION RECT MAKER");
    }
}
