import FreehandMaker from "./ShapeMaker/FreehandMaker/FreehandMaker";
import RectangleMaker from "./ShapeMaker/RectangleMaker/RectangleMaker";
import ShapeMaker from "./ShapeMaker/ShapeMaker";

export default class ShapeMakerManager {
	makers: ShapeMaker[] = [new RectangleMaker(), new FreehandMaker()];
	curr_maker: ShapeMaker;

	constructor() {
		this.curr_maker = this.makers[0];
		this.curr_maker.start();
	}

	switch_maker(key: number) {
		if (key > this.makers.length) {
			console.error("switch_maker error 1");
			return;
		}
		this.curr_maker.stop();
		this.curr_maker = this.makers[key];
		this.curr_maker.start();
	}
}
