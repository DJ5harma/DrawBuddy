import { Shape } from "../Shapes/Shape";
import { CanvasManager } from "./CanvasManager";
import { SelectionManager } from "./SelectionManager";
import { TempCanvasManager } from "./TempCanvasManager";

export class SingleSelectionManager {
	static allow_selection = false;

	static selected_shape: Shape | undefined;

	static init() {
		console.log("SingleSelectionManager init");

		document.addEventListener("click", (e) => {
			if (!this.allow_selection) return;

			const shapes = CanvasManager.get_shapes();
			console.log("total shapes: ", shapes.length);

			const [x, y] = [e.clientX, e.clientY];

			for (let i = shapes.length - 1; i != -1; --i) {
				const { bounding_rect } = shapes[i];
				if (!bounding_rect) {
					console.error("Bounding rect of", shapes[i], "is undefined");
					return;
				}
				const { top_left, bottom_right } = bounding_rect;

				if (
					x > top_left[0] - 10 &&
					x < bottom_right[0] + 10 &&
					y > top_left[1] - 10 &&
					y < bottom_right[1] + 10
				) {
					this.selected_shape = shapes[i];
					SelectionManager.add_shape(shapes[i]);
					// break;
				}
			}
		});
	}

	static start() {
		this.selected_shape = undefined;
		this.allow_selection = true;
	}

	static stop() {
		this.allow_selection = false;
		TempCanvasManager.clear_canvas_only_unrender();
	}
}
