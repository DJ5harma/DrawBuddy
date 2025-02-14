import { buffer_canvas, buffer_ctx, canvas, ctx } from "../../main";
import { CanvasManager } from "./CanvasManager";
import { SelectionManager } from "./SelectionManager";

export class CanvasDragManager {
    private static allowed_by_tool = false;

    private static move = false;
    private static move_start_pos: vec2 = [0, 0];

    public static init() {
        console.log("CanvasDragManager init");
        buffer_canvas.style.visibility = "hidden";

        document.addEventListener("wheel", (e) => {
            if (this.move) return;
            const dirY = e.deltaY < 0 ? 1 : -1;
            console.log(dirY);
            buffer_ctx.drawImage(canvas, 0, 0);
            CanvasManager.get_shapes().forEach((shape) => {
                shape.displace_by([0, dirY * 50]);
            });

            CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
            buffer_ctx.clearRect(
                0,
                0,
                buffer_canvas.width,
                buffer_canvas.height
            );
            SelectionManager.unrender_selection_of_all();
            SelectionManager.render_selection_of_all();
        });

        document.addEventListener("mousedown", (e) => {
            if (e.button !== 1 && !this.allowed_by_tool) return; // Middle mouse button
            document.body.style.cursor = "grab";
            buffer_ctx.drawImage(canvas, 0, 0);
            this.move = true;
            this.move_start_pos = [e.clientX, e.clientY];
        });

        document.addEventListener("mousemove", (e) => {
            if (!this.move) return;

            const new_translate: vec2 = [
                e.clientX - this.move_start_pos[0],
                e.clientY - this.move_start_pos[1],
            ];
            CanvasManager.clear_canvas_only_unrender();
            SelectionManager.unrender_selection_of_all();
            SelectionManager.render_selection_of_all();
            ctx.drawImage(buffer_canvas, ...new_translate);
        });

        document.addEventListener("mouseup", (e) => {
            if (e.button !== 1 && !this.allowed_by_tool) return;
            document.body.style.cursor = "default";
            this.move = false;

            const new_translate: vec2 = [
                e.clientX - this.move_start_pos[0],
                e.clientY - this.move_start_pos[1],
            ];

            CanvasManager.get_shapes().forEach((shape) => {
                shape.displace_by(new_translate);
            });

            CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
            buffer_ctx.clearRect(
                0,
                0,
                buffer_canvas.width,
                buffer_canvas.height
            );

            SelectionManager.unrender_selection_of_all().render_selection_of_all();
        });
    }

    public static allow_by_tool() {
        this.allowed_by_tool = true;
    }
    public static disallow_by_tool() {
        this.allowed_by_tool = false;
    }
}
