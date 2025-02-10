import init_canvas_system from "./canvas_system/init_canvas_system";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /*html*/ `
  <div>
    <canvas id="canvas"></canvas>
  </div>
`;

export const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

export const ctx = canvas.getContext("2d")!;

init_canvas_system();
