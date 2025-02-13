import { Rectangle } from "../Shapes/Rectangle";
import { Shape } from "../Shapes/Shape";
import { CanvasManager } from "./CanvasManager";
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
					this.show_selection_rect();
					break;
				}
			}
		});
	}

	private static show_selection_rect() {
		if (!this.selected_shape?.bounding_rect) {
			console.error("Shape has no bounding_rect: ", this.selected_shape);
			return;
		}

		TempCanvasManager.clear_canvas_only_unrender();

		const { top_left, bottom_right } = this.selected_shape.bounding_rect;
		const rect = new Rectangle({
			pos: [top_left[0] - 10, top_left[1] - 10],
			dims: [
				bottom_right[0] - top_left[0] + 20,
				bottom_right[1] - top_left[1] + 20,
			],
			fill: "rgba(100, 100, 242, 0.1)",
			stroke: { color: "rgba(100, 100, 242, 1)", width: 2 },
		});
		TempCanvasManager.render_shape(rect);
	}

	static start() {
		this.allow_selection = true;
	}

	static stop() {
		this.allow_selection = false;
	}
}
