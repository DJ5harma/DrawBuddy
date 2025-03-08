import init_canvas_system from "./canvas_system/init_canvas_system";
import { Camera } from "./canvas_system/Managers/Camera";
import { ZoomManager } from "./canvas_system/Managers/ZoomManager";
// import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /*html*/ `
  <div>
  <canvas id="buffer_canvas"></canvas>
  <canvas id="canvas"></canvas>
  <canvas id="temp_canvas"></canvas>
  <div id="tool_selector"></div>
  <div id="tool_pallete"></div>
  </div>
`;

document.body.style.backgroundColor = 'rgb(0,0,0)'
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
export const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

const temp_canvas = document.querySelector<HTMLCanvasElement>("#temp_canvas")!;
export const temp_ctx = temp_canvas.getContext("2d", {
    willReadFrequently: true,
})!;

const buffer_canvas =
document.querySelector<HTMLCanvasElement>("#buffer_canvas")!;
export const buffer_ctx = buffer_canvas.getContext("2d", {
    willReadFrequently: true,
})!;

export const canvases = [buffer_canvas, canvas, temp_canvas];

export const camera = new Camera(canvases);
// new ZoomManager(camera);


init_canvas_system()