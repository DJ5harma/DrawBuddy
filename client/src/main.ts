import init_canvas from "./Canvas/init_canvas";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /*html*/ `
  <div>
    <canvas id="canvas"></canvas>
  </div>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

export const ctx = canvas.getContext("2d")!;

init_canvas(canvas);
