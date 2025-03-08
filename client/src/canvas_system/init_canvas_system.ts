import { canvases } from "../main";
import { CanvasManager } from "./Managers/CanvasManager";
import { UndoManager } from "./Managers/UndoManager";
import { CanvasDragManager } from "./Managers/CanvasDragManager";
import { SelectionManager } from "./Managers/SelectionManager";
import { RectangleMaker } from "./Makers/RectangleMaker";
import { CircleMaker } from "./Makers/CircleMaker";
import { LineMaker } from "./Makers/LineMaker";
import { PencilMaker } from "./Makers/PencilMaker";
import { SelectionDragManager } from "./Managers/SelectionDragManager";
import { SelectionMaker } from "./Makers/SelectionMaker";
import { ResizeManager } from "./Managers/ResizeManager";
import { ToolSelector } from "../ui_system/Tools/ToolSelector/ToolSelector";
import { ToolPallete } from "../ui_system/Tools/ToolPallete/ToolPallete";

function design_canvas() {
    document.body.style.overflow = "hidden";
    canvases.forEach((cvs) => {
        const { style } = cvs;

        style.position = "fixed";
        style.left = "0px";
        style.top = "0px";

        cvs.width = window.innerWidth;
        cvs.height = window.innerHeight;
    });
}

export default function init_canvas_system() {
    design_canvas();

    CanvasManager.init();
    CanvasDragManager.init();
    UndoManager.init();

    //
    RectangleMaker.init();
    CircleMaker.init();
    LineMaker.init();
    PencilMaker.init();

    //
    SelectionManager.init();
    SelectionDragManager.init();
    SelectionMaker.init();
    ResizeManager.init();

    // UI
    ToolSelector.init();
    ToolPallete.init();

    let mutex_unlocked = true;

    window.addEventListener("resize", () => {
        canvases.forEach((cvs) => {
            cvs.width = window.innerWidth;
            cvs.height = window.innerHeight;
        });

        if (mutex_unlocked) {
            mutex_unlocked = false;
            setTimeout(() => {
                CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
                mutex_unlocked = true;
            }, 400);
        }
    });
}
