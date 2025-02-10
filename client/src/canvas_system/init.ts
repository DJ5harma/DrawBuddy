import { canvas } from "../main";

export default function init() {
	canvas.style.position = "fixed";
	canvas.style.left = "0px";
	canvas.style.top = "0px";
	canvas.style.border = "solid red";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
