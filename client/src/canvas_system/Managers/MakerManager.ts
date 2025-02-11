import { PencilMaker } from "../Makers/PencilMaker/PencilMaker";
import { RectangleMaker } from "../Makers/RectangleMaker/RectangleMaker";
import { Maker } from "../Makers/Maker";

export class MakerManager {
	private static makersMap = new Map<Tools, Maker>();

	private static curr_maker: Maker;

	static init() {
		this.makersMap.set("PENCIL", new PencilMaker());
		this.makersMap.set("RECTANGLE", new RectangleMaker());

		this.curr_maker = this.makersMap.get("PENCIL")!;

		this.curr_maker.start();
		console.log("MakerManager init");
	}

	static switch_maker(tool_name: Tools) {
		this.curr_maker.stop();
		this.curr_maker = this.makersMap.get(tool_name)!;
		this.curr_maker.set_config({ stroke: { color: "yellow" } });
		this.curr_maker.start();
	}

	static pause_maker() {
		this.curr_maker.stop();
	}
}
