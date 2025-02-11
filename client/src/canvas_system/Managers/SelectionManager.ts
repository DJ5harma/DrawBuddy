import { SelectionRectangleMaker } from "../Makers/SelectionRectangleMaker/SelectionRectangleMaker";

export class SelectionManager {
	static selecting = false;

	static init() {
		console.log(this.name);
	}

	static start_selection_lifecycle() {
		this.selecting = true;
		const rect_maker = new SelectionRectangleMaker();
		rect_maker.start();
	}

	static stop_selection() {
		this.selecting = false;
	}
}
