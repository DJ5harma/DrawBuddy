import FreehandMaker from "../ShapeMaker/FreehandMaker/FreehandMaker";
import RectangleMaker from "../ShapeMaker/RectangleMaker/RectangleMaker";
import ShapeMaker from "../ShapeMaker/ShapeMaker";

export default class ShapeMakerManager {
	private static makers: ShapeMaker[] = [
		new RectangleMaker(),
		new FreehandMaker(),
	];
	private static curr_maker: ShapeMaker;

	static init() {
		this.curr_maker = this.makers[1];
		this.curr_maker.start();
		console.log("ShapeMakerManager init");
	}

	static switch_maker(key: number) {
		if (key > this.makers.length) {
			console.error("switch_maker error 1");
			return;
		}
		this.curr_maker.stop();
		this.curr_maker = this.makers[key];
		this.curr_maker.start();
	}
}
