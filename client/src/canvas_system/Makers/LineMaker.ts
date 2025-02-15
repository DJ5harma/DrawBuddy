import { Line } from "../Shapes/Line";
import { Maker } from "./Maker";
import { CanvasManager } from "../Managers/CanvasManager";
import { TempCanvasManager } from "../Managers/TempCanvasManager";
import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";
import { ToolSelector } from "../../ui_system/Tools/ToolSelector/ToolSelector";

let draw = false;

let curr = new Line({
    start: [0, 0],
    end: [0, 0],
    stroke: { color: "rgb(255, 0, 255)", width: 5 },
});

export class LineMaker extends Maker {
    public static init(): void {
        document.addEventListener("mousedown", this.mousedown);
        document.addEventListener("mousemove", this.mousemove);
        document.addEventListener("mouseup", this.mouseup);
    }

    protected static mousedown(e: MouseEvent): void {
        if (e.button !== 0 || ToolSelector.selected_tool !== "LINE") return;

        draw = true;

        curr.start = [e.clientX, e.clientY];
        curr.end = [...curr.start];

        curr.stroke = {
            color: ToolPallete.stroke.color,
            width: ToolPallete.stroke.width,
        };
    }

    protected static mousemove(e: MouseEvent): void {
        if (!draw) return;

        curr.end = [e.clientX, e.clientY];
        TempCanvasManager.clear_canvas_only_unrender().render_shape(curr);
    }

    protected static mouseup(e: MouseEvent): void {
        if (e.button !== 0 || !draw) return;
        draw = false;

        CanvasManager.store_shape(curr).render_shape(curr);
        TempCanvasManager.clear_canvas_only_unrender();
    }
}
