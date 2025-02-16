import { buffer_ctx, ctx, temp_ctx } from "../../main";
import { CanvasManager } from "./CanvasManager";
import { SelectionManager } from "./SelectionManager";

let zooming = false;
let size = 1;

export class ZoomManager {
    static init() {
        console.log("init ZoomManager");

        window.addEventListener("wheel", this.wheel.bind(this), {
            passive: false,
        });
    }

    private static wheel = (e: WheelEvent) => {
        e.preventDefault();
        if (!e.ctrlKey) return;

        const dy = e.deltaY;
        console.log("ZOOMING", dy);

        // size = Math.max(0.5, Math.min(dy < 0 ? 5 : -5, 5));

        // ctx.scale(size, size);
        // temp_ctx.scale(size, size);
        // buffer_ctx.scale(size, size);

        // ctx.setTransform(size, 0, 0, size, 0, 0);
        // temp_ctx.setTransform(size, 0, 0, size, 0, 0);
        // buffer_ctx.setTransform(size, 0, 0, size, 0, 0);

        // let rejected_zoom = false;
        CanvasManager.get_shapes().forEach((shape) => {
            shape.resize_handle = "se";
            shape.zoom_by(dy / 10);
        });
        CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
        SelectionManager.unrender_selection_of_all().remove_selection_of_all();
    };
}
