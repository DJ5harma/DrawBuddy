import { canvas } from "../main";
import FreehandMaker from "./ShapeMaker/FreehandMaker/FreehandMaker";
import RectangleMaker from "./ShapeMaker/RectangleMaker/RectangleMaker";
import ShapeMaker from "./ShapeMaker/ShapeMaker";

export default class ShapeMakerManager {
	makers: ShapeMaker[] = [new RectangleMaker(), new FreehandMaker()];
	curr_maker: ShapeMaker;

	constructor() {
		this.curr_maker = this.makers[0];

		window.addEventListener("resize", () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		});
	}
}
