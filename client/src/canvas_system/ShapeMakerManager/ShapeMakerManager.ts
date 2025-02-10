import PencilMaker from "../ShapeMaker/PencilMaker/Pencil";
import RectangleMaker from "../ShapeMaker/RectangleMaker/RectangleMaker";
import ShapeMaker from "../ShapeMaker/ShapeMaker";

export default class ShapeMakerManager {
	private static makersMap = new Map<Tools, ShapeMaker>();

	private static curr_maker: ShapeMaker;

	static init() {
		this.makersMap.set("PENCIL", new PencilMaker());
		this.makersMap.set("RECTANGLE", new RectangleMaker());

		this.curr_maker = this.makersMap.get("PENCIL")!;

		this.curr_maker.start();
		console.log("ShapeMakerManager init");
	}

	static switch_maker(tool_name: Tools) {
		const new_maker = this.makersMap.get(tool_name)!;
		if (new_maker === this.curr_maker) return;

		this.curr_maker.stop();
		this.curr_maker = new_maker;
		this.curr_maker.start();
	}
}
