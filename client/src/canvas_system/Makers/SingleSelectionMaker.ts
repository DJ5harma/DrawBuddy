import { canvas, ctx } from "../../main";
import { CanvasManager } from "../Managers/CanvasManager";
import { SelectionManager } from "../Managers/SelectionManager";
import { TempCanvasManager } from "../Managers/TempCanvasManager";
import { Shape } from "../Shapes/Shape";

export class SingleSelectionManager {
  private static allow_selection = false;
  public static curr_Shape: Shape | undefined = undefined;
  public move = false;
  public move_start_pos: vec2 = [0, 0];

  static init() {
    console.log("SingleSelectionManager init");

    document.addEventListener("click", (e) => {
      if (!SingleSelectionManager.allow_selection) return;

      const shapes = CanvasManager.get_shapes();

      const [x, y] = [
        e.clientX - canvas.getBoundingClientRect().left,
        e.clientY - canvas.getBoundingClientRect().left,
      ];

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
          this.curr_Shape = shapes[i];
          SelectionManager.add_shape(shapes[i]).render_selection_of_shape(
            shapes[i]
          );
          const selectionManager = new SingleSelectionManager();
          selectionManager.enableSelection();
          break;
        }
      }
    });
  }

  public mousedown(e: MouseEvent) {
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;

    if (SingleSelectionManager.curr_Shape?.bounding_rect) {
      let left =
        SingleSelectionManager.curr_Shape.bounding_rect.top_left[0] - 10;
      let top =
        SingleSelectionManager.curr_Shape.bounding_rect.top_left[1] - 10;
      let right =
        SingleSelectionManager.curr_Shape.bounding_rect.bottom_right[0] - 10;
      let bottom =
        SingleSelectionManager.curr_Shape.bounding_rect.bottom_right[1] - 10;

      if (x >= left && x <= right && y >= top && y <= bottom) {
        document.body.style.cursor = "grab";
        this.move = true;
        this.move_start_pos = [e.clientX, e.clientY];
      }
    }
  }
  public mousemove(e: MouseEvent) {
    if (!this.move) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const delta: vec2 = [
      currentX - this.move_start_pos[0],
      currentY - this.move_start_pos[1],
    ];

    const shape = SingleSelectionManager.curr_Shape;
    if (shape) {
      shape.displace_by(delta);

      this.move_start_pos = [currentX, currentY];

      TempCanvasManager.clear_canvas_only_unrender().render_shape(shape);

      CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();
    }
  }
  public mouseup(): void {
	if (!this.move) return;
	
	this.move = false;
	
	document.body.style.cursor = "default";
	
	TempCanvasManager.clear_canvas_only_unrender();
	
	CanvasManager.clear_canvas_only_unrender().render_stored_shapes_all();	
	ctx.closePath();
  }
  

  public enableSelection(): void {
    document.addEventListener("mousedown", this.mousedown);
    document.addEventListener("mousemove", this.mousemove);
    document.addEventListener("mouseup", this.mouseup);
  }
  public enableStop(): void {
    document.removeEventListener("mousedown", this.mousedown);
    document.removeEventListener("mousemove", this.mousemove);
    document.removeEventListener("mouseup", this.mouseup);
  }

  static start() {
    this.allow_selection = true;
  }

  static stop() {
    this.allow_selection = false;
  }
}
