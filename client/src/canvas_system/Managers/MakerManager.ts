import { PencilMaker } from "../Makers/PencilMaker/PencilMaker";
import { RectangleMaker } from "../Makers/RectangleMaker/RectangleMaker";
import { Maker } from "../Makers/Maker";
import { TempCanvasManager } from "./CanvasManager/TempCanvasManager";

export class MakerManager {
	private static makersMap = new Map<Tools, Maker>();

	private static curr_maker: Maker;

	static init() {
		console.log(this.name);

		this.makersMap.set("PENCIL", new PencilMaker());
		this.makersMap.set("RECTANGLE", new RectangleMaker());

		this.curr_maker = this.makersMap.get("RECTANGLE")!;

		this.curr_maker.start();
	}

	static switch_maker(tool_name: Tools) {
		this.pause_maker();
		this.curr_maker = this.makersMap.get(tool_name)!;
		this.curr_maker.set_config({
			stroke: { color: "rgb(255, 255, 0)" },
		});
		this.curr_maker.start();
	}

	static pause_maker() {
		TempCanvasManager.clear_canvas_only_unrender();
		this.curr_maker.stop();
	}
}
