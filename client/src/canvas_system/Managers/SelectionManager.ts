import { ToolPallete } from "../../ui_system/Tools/ToolPallete/ToolPallete";
import { RectangleSelectionMaker } from "../Makers/RectangleSelectionMaker";
import { Rectangle } from "../Shapes/Rectangle";
import { Shape } from "../Shapes/Shape";
import { CanvasManager } from "./CanvasManager";
import { SingleSelectionManager } from "../Makers/SingleSelectionMaker";
import { TempCanvasManager } from "./TempCanvasManager";

export class SelectionManager {
	private static selecting = false;

	private static selector_rect: RectangleSelectionMaker;

	private static selected_shapes = new Set<Shape>();

	public static init() {
		console.log(this.name);
	}

	public static start_selection_lifecycle() {
		this.selected_shapes = new Set();
		this.selecting = true;
		this.selector_rect = new RectangleSelectionMaker();
		SingleSelectionManager.start();
		this.selector_rect.start();
	}

	public static stop_selection_lifecycle() {
		this.selecting = false;
		if (!this.selector_rect) return;
		this.selector_rect.stop();
		this.selected_shapes = new Set();
	}

	public static add_shape(shape: Shape) {
		console.log(shape, "added to selection list");
		if (!this.selected_shapes.has(shape)) this.selected_shapes.add(shape);
		return this;
	}

	public static render_selection_of_shape(shape: Shape) {
		if (!shape.bounding_rect) {
			console.error("Shape has no bounding_rect: ", shape);
			return;
		}

		const { top_left, bottom_right } = shape.bounding_rect;

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
	public static render_selection_of_all() {
		TempCanvasManager.clear_canvas_only_unrender();
		this.selected_shapes.forEach((shape) => {
			this.render_selection_of_shape(shape);
		});
	}
	public static unrender_selection_of_all() {
		TempCanvasManager.clear_canvas_only_unrender();
		this.selected_shapes = new Set();
	}

	public static is_selecting() {
		return this.selecting;
	}

	public static is_shape_selected(shape: Shape) {
		return this.selected_shapes.has(shape);
	}

	public static update_selected_shapes_from_pallete() {
		console.log(this.selected_shapes, " selected");

		if (!this.selected_shapes.size) return;

		this.selected_shapes.forEach((shape) => {
			if (shape.fill) {
				console.log("prev fill: ", shape.fill);
				shape.fill = ToolPallete.fill;
				console.log("new fill: ", shape.fill);
			}
			if (shape.stroke) {
				console.log("prev stroke: ", shape.stroke);
				shape.stroke = { ...ToolPallete.stroke };
				console.log("new stroke: ", shape.stroke);
			}
		});
		CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
		this.render_selection_of_all();
	}
}
