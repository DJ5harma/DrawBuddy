import { CanvasManager } from "./CanvasManager";

export class CanvasDragger {
	static location: vec2 = [0, 0];

	static move: boolean = false;

	static init() {
		console.log("CanvasDragger init");

		document.addEventListener("wheel", (e) => {
			const { deltaY } = e;

			const dir_multiple = deltaY < 0 ? 1 : -1;
			const displacement: vec2 = [0, dir_multiple * 50];

			this.location[1] += displacement[1];

			this.move_canvas_by_displacement(displacement);
			console.log(this.location);
		});

		document.addEventListener("mousedown", (e) => {
			if (e.button !== 1) return;
			this.move = true;
		});

		document.addEventListener("mousemove", (e) => {
			if (!this.move) return;

			const displacement: vec2 = [
				e.clientX - this.location[0],
				e.clientY - this.location[1],
			];

			this.move_canvas_by_displacement(displacement);

			this.location[0] += displacement[0];
			this.location[1] += displacement[1];
		});

		document.addEventListener("mouseup", (e) => {
			if (e.button !== 1) return;
			this.move = false;
		});
	}

	static move_canvas_by_displacement(displacement: vec2) {
		// CanvasManager.get_shapes().forEach((shape) => {
		// shape.displace_by(displacement);
		// });
		// CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
	}
}
