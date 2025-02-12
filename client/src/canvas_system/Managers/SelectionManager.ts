import { SelectionRectangleMaker } from "../Makers/SelectionRectangleMaker";

export class SelectionManager {
	private static selecting = false;

	static init() {
		console.log(this.name);
	}

	static start_selection_lifecycle() {
		this.selecting = true;
		const rect_maker = new SelectionRectangleMaker();
		rect_maker.start();
	}

	static stop_selection_lifecycle() {
		this.selecting = false;
	}

	static is_selecting() {
		return this.selecting;
	}
}
