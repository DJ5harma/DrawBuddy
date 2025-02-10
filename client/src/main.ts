import init_canvas_system from "./canvas_system/init_canvas_system";
import "./style.css";
import init_ui_system from "./ui_system/init_ui_system";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /*html*/ `
  <div>
  <canvas id="canvas"></canvas>
  <canvas id="temp_canvas"></canvas>
  <div id="tool_selector"></div>
  </div>
`;

export const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

export const ctx = canvas.getContext("2d")!;

export const temp_canvas =
	document.querySelector<HTMLCanvasElement>("#temp_canvas")!;

export const temp_ctx = temp_canvas.getContext("2d")!;

// temp_canvas.style.backgroundColor = "rgba(0, 0, 0, 0.3)";

init_canvas_system();
init_ui_system();
