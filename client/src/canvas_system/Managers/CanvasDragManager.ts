import { buffer_canvas, buffer_ctx, canvas, ctx } from "../../main";
import { ToolSelector } from "../../ui_system/Tools/ToolSelector/ToolSelector";
import { CanvasManager } from "./CanvasManager";
import { SelectionManager } from "./SelectionManager";

let move = false;
let move_start_pos: vec2 = [0, 0];

export class CanvasDragManager {
    public static init() {
        console.log("CanvasDragManager init");
        buffer_canvas.style.visibility = "hidden";

        document.addEventListener("wheel", this.wheel);
        document.addEventListener("mousedown", this.mousedown);
        document.addEventListener("mousemove", this.mousemove);
        document.addEventListener("mouseup", this.mouseup);
    }

    private static wheel(e: WheelEvent) {
        if (move) return;
        const dirY = e.deltaY < 0 ? 1 : -1;
        console.log(dirY);
        buffer_ctx.drawImage(canvas, 0, 0);
        CanvasManager.get_shapes().forEach((shape) => {
            shape.displace_by([0, dirY * 50]);
        });

        CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
        buffer_ctx.clearRect(0, 0, buffer_canvas.width, buffer_canvas.height);
        SelectionManager.unrender_selection_of_all();
        SelectionManager.render_selection_of_all();
    }

    private static mousedown(e: MouseEvent) {
        if (e.button !== 1 && ToolSelector.selected_tool !== "CANVAS-DRAGGER")
            return; // Middle mouse button
        document.body.style.cursor = "grab";
        buffer_ctx.drawImage(canvas, 0, 0);
        move = true;
        move_start_pos = [e.clientX, e.clientY];
    }

    private static mousemove(e: MouseEvent) {
        if (!move) return;

        const new_translate: vec2 = [
            e.clientX - move_start_pos[0],
            e.clientY - move_start_pos[1],
        ];
        CanvasManager.clear_canvas_only_unrender();
        SelectionManager.unrender_selection_of_all();
        SelectionManager.render_selection_of_all();
        ctx.drawImage(buffer_canvas, ...new_translate);
    }

    private static mouseup(e: MouseEvent) {
        if (e.button !== 1 && ToolSelector.selected_tool !== "CANVAS-DRAGGER")
            return;
        document.body.style.cursor = "default";
        move = false;

        const new_translate: vec2 = [
            e.clientX - move_start_pos[0],
            e.clientY - move_start_pos[1],
        ];

        CanvasManager.get_shapes().forEach((shape) => {
            shape.displace_by(new_translate);
        });

        CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
        buffer_ctx.clearRect(0, 0, buffer_canvas.width, buffer_canvas.height);

        SelectionManager.unrender_selection_of_all().render_selection_of_all();
    }
}
