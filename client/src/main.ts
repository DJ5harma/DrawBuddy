import init_canvas_system from "./canvas_system/init_canvas_system";
import "./style.css";
import init_ui_system from "./ui_system/init_ui_system";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /*html*/ `
  <div>
  <canvas id="canvas"></canvas>
  <div id="tool_selector"></div>
  </div>
`;

export const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

export const ctx = canvas.getContext("2d")!;

init_canvas_system();
init_ui_system();
