import { SelectionRectangleMaker } from "../Makers/SelectionRectangleMaker";

export class SelectionManager {
	private static selecting = false;

	public static init() {
		console.log(this.name);
	}

	public static start_selection_lifecycle() {
		this.selecting = true;
		const rect_maker = new SelectionRectangleMaker();
		rect_maker.start();
	}

	public static stop_selection_lifecycle() {
		this.selecting = false;
	}

	public static is_selecting() {
		return this.selecting;
	}
}
