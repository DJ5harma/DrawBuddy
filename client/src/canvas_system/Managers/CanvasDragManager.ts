import { buffer_canvas, buffer_ctx, canvas, ctx } from "../../main";
import { CanvasManager } from "./CanvasManager";

export class CanvasDragManager {
	private static allowed_by_tool = false;

	private static move = false;
	private static move_start_pos: vec2 = [0, 0];

	static init() {
		console.log("CanvasDragManager init");
		buffer_canvas.style.visibility = "hidden";

		document.addEventListener("mousedown", (e) => {
			if (e.button !== 1 && !this.allowed_by_tool) return; // Middle mouse button
			buffer_ctx.drawImage(canvas, 0, 0);
			this.move = true;
			this.move_start_pos = [e.clientX, e.clientY];
		});

		document.addEventListener("mousemove", (e) => {
			if (!this.move) return;

			const new_translate: vec2 = [
				e.clientX - this.move_start_pos[0],
				e.clientY - this.move_start_pos[1],
			];
			CanvasManager.clear_canvas_only_unrender();
			ctx.drawImage(buffer_canvas, ...new_translate);
		});

		document.addEventListener("mouseup", (e) => {
			if (e.button !== 1 && !this.allowed_by_tool) return;
			this.move = false;

			buffer_ctx.clearRect(0, 0, buffer_canvas.width, buffer_canvas.height);

			const new_translate: vec2 = [
				e.clientX - this.move_start_pos[0],
				e.clientY - this.move_start_pos[1],
			];

			CanvasManager.get_shapes().forEach((shape) => {
				shape.displace_by(new_translate);
			});

			CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
		});
	}

	static allow_by_tool() {
		this.allowed_by_tool = true;
	}
	static disallow_by_tool() {
		this.allowed_by_tool = false;
	}
}
