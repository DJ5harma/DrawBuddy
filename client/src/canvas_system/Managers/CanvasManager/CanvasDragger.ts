import { buffer_canvas, buffer_ctx, canvas, ctx } from "../../../main";
import { CanvasManager } from "./CanvasManager";

export class CanvasDragger {
	private static move_start_pos: vec2 = [0, 0];

	private static move: boolean = false;

	static init() {
		console.log("CanvasDragger init");
		buffer_canvas.style.visibility = "hidden";
		buffer_canvas.width = window.innerWidth * 2;
		buffer_canvas.height = window.innerHeight * 2;

		document.addEventListener("mousedown", (e) => {
			if (e.button !== 1) return; // Middle mouse button
			buffer_ctx.drawImage(canvas, 0, 0);
			this.move = true;
			this.move_start_pos = [e.clientX, e.clientY];
		});

		document.addEventListener("mousemove", (e) => {
			if (!this.move) return;

			// ctx.translate(0, 0);
			const new_translate: vec2 = [
				e.clientX - this.move_start_pos[0],
				e.clientY - this.move_start_pos[1],
			];
			CanvasManager.clear_canvas_only_unrender();
			ctx.drawImage(buffer_canvas, ...new_translate);

			// this.move_start_pos = [e.clientX, e.clientY];
		});

		document.addEventListener("mouseup", (e) => {
			if (e.button !== 1) return;
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
}
