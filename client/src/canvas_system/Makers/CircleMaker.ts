import { Circle } from "../Shapes/Circle";
import { Maker } from "./Maker";
import { CanvasManager } from "../Managers/CanvasManager";
import { TempCanvasManager } from "../Managers/TempCanvasManager";
import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";
import { ToolSelector } from "../../ui_system/Tools/ToolSelector/ToolSelector";
import { camera, temp_canvas } from "../../main";

let draw = false;

const curr = new Circle();

export class CircleMaker extends Maker {
    public static init(): void {
        document.addEventListener("mousedown", this.mousedown);
        document.addEventListener("mousemove", this.mousemove);
        document.addEventListener("mouseup", this.mouseup);
    }

    protected static mousedown(e: MouseEvent): void {
        if (e.button !== 0 || ToolSelector.selected_tool !== "CIRCLE") return;

        draw = true;

        const rect = temp_canvas.getBoundingClientRect();

        const screenPos: vec2 = [e.clientX - rect.left, e.clientY - rect.top];
        const worldPos = camera.screenToWorld(screenPos);
        curr.pos = worldPos;
        curr.radius = 0;

        curr.fill = ToolPallete.fill;
        curr.stroke = {
            color: ToolPallete.stroke.color,
            width: ToolPallete.stroke.width,
        };
    }

    protected static mousemove(e: MouseEvent): void {
        if (!draw) return;
        const [x, y] = [e.clientX, e.clientY];
        const dx = x - curr.pos[0];
        const dy = y - curr.pos[1];

        curr.radius = Math.sqrt(dx * dx + dy * dy);

        TempCanvasManager.clear_canvas_only_unrender().render_shape(curr);
    }

    protected static mouseup(e: MouseEvent): void {
        if (e.button !== 0 || !draw) return;
        draw = false;

        CanvasManager.store_shape(curr);
    }
}
