import init_canvas_system from "./canvas_system/init_canvas_system";
import "./style.css";
import init_ui_system from "./ui_system/init_ui_system";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /*html*/ `
  <div>
  <canvas id="buffer_canvas"></canvas>
  <canvas id="canvas"></canvas>
  <canvas id="temp_canvas"></canvas>
  <div id="tool_selector"></div>
  <div id="tool_pallete"></div>
  </div>
`;

export const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
export const ctx = canvas.getContext("2d")!;

export const temp_canvas =
    document.querySelector<HTMLCanvasElement>("#temp_canvas")!;
export const temp_ctx = temp_canvas.getContext("2d", {
    willReadFrequently: true,
})!;

export const buffer_canvas =
    document.querySelector<HTMLCanvasElement>("#buffer_canvas")!;
export const buffer_ctx = buffer_canvas.getContext("2d")!;

export const canvases = [buffer_canvas, canvas, temp_canvas];

init_canvas_system();
init_ui_system();
