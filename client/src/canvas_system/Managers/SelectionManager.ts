import { SelectionRectangleMaker } from "../Makers/SelectionRectangleMaker";

export class SelectionManager {
	private static selecting = false;

	private static selector_rect: SelectionRectangleMaker;

	public static init() {
		console.log(this.name);
	}

	public static start_selection_lifecycle() {
		this.selecting = true;
		this.selector_rect = new SelectionRectangleMaker();
		this.selector_rect.start();
	}

	public static stop_selection_lifecycle() {
		this.selecting = false;
		if (!this.selector_rect) return;
		this.selector_rect.stop();
	}

	public static is_selecting() {
		return this.selecting;
	}
}
