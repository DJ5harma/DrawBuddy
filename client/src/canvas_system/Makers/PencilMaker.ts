import { temp_ctx } from "../../main";
import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";
import { ToolSelector } from "../../ui_system/Tools/ToolSelector/ToolSelector";
import { CanvasManager } from "../Managers/CanvasManager";
import { TempCanvasManager } from "../Managers/TempCanvasManager";
import { Pencil } from "../Shapes/Pencil";
import { Maker } from "./Maker";

let draw = false;

let points: vec2[] = [];

const curr = new Pencil();

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

        console.log("added Cached image data: ", curr.cached_image_data);

        CanvasManager.store_shape(curr);
        TempCanvasManager.clear_canvas_only_unrender();
    }
}
