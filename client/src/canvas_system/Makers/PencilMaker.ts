import { temp_ctx, temp_canvas } from "../../main";
import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";
import { ToolSelector } from "../../ui_system/Tools/ToolSelector/ToolSelector";
import { CanvasManager } from "../Managers/CanvasManager";
import { TempCanvasManager } from "../Managers/TempCanvasManager";
import { Pencil } from "../Shapes/Pencil";
import { Maker } from "./Maker";

let draw = false;

let curr = new Pencil({ stroke: { color: "rgb(255, 255, 255)", width: 5 } });

export class PencilMaker extends Maker {
    public static init(): void {
        document.addEventListener("mousedown", this.mousedown);
        document.addEventListener("mousemove", this.mousemove);
        document.addEventListener("mouseup", this.mouseup);
    }

    protected static mousedown(e: MouseEvent): void {
        if (e.button !== 0 || ToolSelector.selected_tool !== "PENCIL") return;
        console.log(ToolSelector.selected_tool, "FROM PENCIL MAKER");

        draw = true;

        curr.stroke = {
            color: ToolPallete.stroke.color,
            width: ToolPallete.stroke.width,
        };

        curr.prepare_for_render(temp_ctx);

        temp_ctx.moveTo(e.clientX, e.clientY);
        temp_ctx.beginPath();

        curr.points = [[e.clientX, e.clientY]];
    }

    protected static mousemove(e: MouseEvent): void {
        if (!draw) return;

        const [x, y] = [e.clientX, e.clientY];

        curr.points.push([x, y]);

        temp_ctx.lineTo(x, y);
        temp_ctx.stroke();
        temp_ctx.moveTo(x, y);
    }

    protected static mouseup(e: MouseEvent): void {
        if (e.button !== 0 || !draw) return;
        draw = false;
        temp_ctx.closePath();

        curr.cached_image_data = {
            img: temp_ctx.getImageData(
                0,
                0,
                temp_canvas.width,
                temp_canvas.height
            ),
            sx: 0,
            sy: 0,
        };

        console.log("added Cached image data: ", curr.cached_image_data);

        PencilMaker.ensure_bounding_rect();
        CanvasManager.store_shape(curr).render_shape(curr);
        TempCanvasManager.clear_canvas_only_unrender();
    }

    public static ensure_bounding_rect(): void {
        let min_x: number, max_x: number, min_y: number, max_y: number;
        const pts = curr.points;
        min_x = pts[0][0];
        min_y = pts[0][1];

        max_x = pts[0][0];
        max_y = pts[0][1];

        if (!pts.length) return;

        pts.forEach(([x, y]) => {
            min_x = Math.min(min_x, x);
            min_y = Math.min(min_y, y);

            max_x = Math.max(max_x, x);
            max_y = Math.max(max_y, y);
        });

        curr.bounding_rect = {
            top_left: [min_x, min_y],
            bottom_right: [max_x, max_y],
        };
    }

    public static set_config(_config: { stroke: Stroke }): void {
        curr.stroke = _config.stroke;
    }
}
