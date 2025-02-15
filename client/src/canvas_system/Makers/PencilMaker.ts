import { temp_ctx, temp_canvas } from "../../main";
import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";
import { ToolSelector } from "../../ui_system/Tools/ToolSelector/ToolSelector";
import { CanvasManager } from "../Managers/CanvasManager";
import { TempCanvasManager } from "../Managers/TempCanvasManager";
import { Pencil } from "../Shapes/Pencil";
import { Maker } from "./Maker";

let draw = false;

let points: vec2[] = [];

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

        points = [[e.clientX, e.clientY]];
    }

    protected static mousemove(e: MouseEvent): void {
        if (!draw) return;

        const [x, y] = [e.clientX, e.clientY];

        points.push([x, y]);

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

        CanvasManager.store_shape(curr).render_shape(curr);
        TempCanvasManager.clear_canvas_only_unrender();
    }

    public static set_config(_config: { stroke: Stroke }): void {
        curr.stroke = _config.stroke;
    }
}
