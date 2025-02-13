import { SelectionManager } from "../../../canvas_system/Managers/SelectionManager";
import { MakerManager } from "../../../canvas_system/Managers/MakerManager";
import { CanvasDragManager } from "../../../canvas_system/Managers/CanvasDragManager";

export class ToolSelector {
	private static tool_selector: HTMLDivElement;

	public static init() {
		this.tool_selector =
			document.querySelector<HTMLDivElement>("#tool_selector")!;

		this.setup_canvas_dragger();
		this.setup_drawers();
		this.setup_selection_maker();
	}

	public static stop_all() {
		MakerManager.pause_maker();
		SelectionManager.stop_selection_lifecycle();
		CanvasDragManager.disallow_by_tool();
	}

	private static style_btn(elem: HTMLButtonElement) {
		const { style } = elem;
		style.border = "solid cyan";
		style.borderRadius = "20px";
		style.padding = "10px";
		style.color = "white";
	}

	private static setup_selection_maker() {
		const tool_name = "SELECTION";
		const elem = document.createElement("button");
		this.tool_selector.appendChild(elem);

		this.style_btn(elem);

		elem.innerText = tool_name;

		elem.addEventListener("click", (_) => {
			console.log(tool_name, "clicked");
			this.stop_all();
			SelectionManager.start_selection_lifecycle();
			return;
		});
	}

	private static setup_canvas_dragger() {
		const tool_name = "CANVAS_DRAGGER";
		const elem = document.createElement("button");
		this.tool_selector.appendChild(elem);

		this.style_btn(elem);

		elem.innerText = tool_name;

		elem.addEventListener("click", (_) => {
			console.log(tool_name, "clicked");
			this.stop_all();
			CanvasDragManager.allow_by_tool();
		});
	}

	private static setup_drawers() {
		console.log("tool_selector ui init");

		const style = this.tool_selector.style;

		style.position = "fixed";
		style.width = "50%";

		style.top = "20px";
		style.left = "25%";

		style.backgroundColor = "rgb(179, 194, 43)";

		style.padding = "10px";

		style.display = "flex";
		style.justifyContent = "space-around";

		style.userSelect = "none";

		MakerManager.maker_names.forEach((name) => {
			const elem = document.createElement("button");
			this.tool_selector.appendChild(elem);

			this.style_btn(elem);

			elem.innerText = name;

			elem.addEventListener("click", (_) => {
				console.log(name, "clicked");
				this.stop_all();
				MakerManager.switch_maker(name);
			});
		});
	}
}
