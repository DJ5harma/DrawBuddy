import { CanvasManager } from "./CanvasManager";

export class CanvasDragger {
	static location: vec2 = [0, 0];

	static init() {
		console.log("CanvasDragger init");

		window.addEventListener("wheel", (e) => {
			const { deltaY } = e;

			const dir_multiple = deltaY < 0 ? -1 : 1;
			const displacement: vec2 = [0, dir_multiple * 50];

			this.location[1] += displacement[1];

			console.log(this.location);

			CanvasManager.get_shapes().forEach((shape) => {
				shape.displace_by(displacement);
			});

			CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
		});
	}
}
