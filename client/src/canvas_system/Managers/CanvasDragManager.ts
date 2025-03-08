import { buffer_ctx, ctx } from "../../main";
import { ToolSelector } from "../../ui_system/Tools/ToolSelector/ToolSelector";
import { CanvasManager } from "./CanvasManager";

let move = false;
let move_start_pos: vec2 = [0, 0];

export class CanvasDragManager {
    public static init() {
        console.log("CanvasDragManager init");
        buffer_ctx.canvas.style.visibility = "hidden";

        document.addEventListener("wheel", this.wheel);
        document.addEventListener("mousedown", this.mousedown);
        document.addEventListener("mousemove", this.mousemove);
        document.addEventListener("mouseup", this.mouseup);
    }

    private static wheel(e: WheelEvent) {
        if (move || e.ctrlKey) return;
        const dirY = e.deltaY < 0 ? 1 : -1;
        CanvasManager.displace_canvas_by([0, dirY * 50]);
    }

    private static mousedown(e: MouseEvent) {
        if (e.button !== 1 && ToolSelector.selected_tool !== "CANVAS-DRAGGER")
            return; // Middle mouse button

        document.body.style.cursor = "grab";
        move = true;
        move_start_pos = [e.clientX, e.clientY];

        buffer_ctx.clearRect(
            0,
            0,
            buffer_ctx.canvas.width,
            buffer_ctx.canvas.height
        );
        buffer_ctx.drawImage(ctx.canvas, 0, 0);
    }

    private static mousemove(e: MouseEvent) {
        if (!move) return;

        const new_translate = [
            e.clientX - move_start_pos[0],
            e.clientY - move_start_pos[1],
        ] as vec2;

        CanvasManager.clear_canvas_only_unrender();
        ctx.drawImage(buffer_ctx.canvas, ...new_translate);
    }

    private static mouseup(e: MouseEvent) {
        if (e.button !== 1 && ToolSelector.selected_tool !== "CANVAS-DRAGGER")
            return;
        document.body.style.cursor = "default";
        move = false;

        const new_translate = [
            e.clientX - move_start_pos[0],
            e.clientY - move_start_pos[1],
        ] as vec2;
        CanvasManager.displace_canvas_by(new_translate);
    }
}
