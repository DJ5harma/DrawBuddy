import { PencilMaker } from "../Makers/PencilMaker";
import { RectangleMaker } from "../Makers/RectangleMaker";
import { Maker } from "../Makers/Maker";

export class MakerManager {
	public static maker_names: Tools[] = ["PENCIL", "RECTANGLE"];

	private static makers_map = new Map<Tools, Maker>();

	private static curr_maker: Maker;

	public static init() {
		console.log(this.name);

		this.makers_map.set("PENCIL", new PencilMaker());
		this.makers_map.set("RECTANGLE", new RectangleMaker());

		this.curr_maker = this.makers_map.get("RECTANGLE")!;

		this.curr_maker.start();
	}

	public static switch_maker(tool_name: Tools) {
		this.pause_maker();
		this.curr_maker = this.makers_map.get(tool_name)!;
		this.curr_maker.set_config({
			stroke: { color: "rgb(255, 255, 0)", width: 5 },
		});
		this.curr_maker.start();
	}

	public static pause_maker() {
		this.curr_maker.stop();
	}
}
