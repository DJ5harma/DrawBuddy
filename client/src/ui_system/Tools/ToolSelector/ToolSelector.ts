import { SelectionManager } from "../../../canvas_system/Managers/SelectionManager";
import { MakerManager } from "../../../canvas_system/Managers/MakerManager";

export class ToolSelector {
	static tool_names: Tools[];
	static tool_selector: HTMLDivElement;

	static init() {
		this.tool_selector =
			document.querySelector<HTMLDivElement>("#tool_selector")!;

		this.setup_drawers();
		this.setup_selection();
	}

	static style_btn(elem: HTMLButtonElement) {
		const { style } = elem;
		style.border = "solid cyan";
		style.borderRadius = "20px";
		style.padding = "10px";
		style.color = "white";
	}

	static setup_selection() {
		const tool_name = "SELECTION";
		const elem = document.createElement("button");
		this.tool_selector.appendChild(elem);

		this.style_btn(elem);

		elem.innerText = tool_name;

		elem.addEventListener("click", (_) => {
			console.log(tool_name, "clicked");
			MakerManager.pause_maker();
			SelectionManager.start_selection_lifecycle();
		});
	}

	static setup_drawers() {
		this.tool_names = ["RECTANGLE", "PENCIL"];

		console.log("tool_selector ui init");

		this.tool_selector.addEventListener("mousedown", (e) => {
			if (SelectionManager.selecting) return;
			e.stopPropagation();
		});

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

		this.tool_names.forEach((name) => {
			const elem = document.createElement("button");
			this.tool_selector.appendChild(elem);

			this.style_btn(elem);

			elem.innerText = name;

			elem.addEventListener("click", (_) => {
				console.log(name, "clicked");
				SelectionManager.stop_selection();
				MakerManager.switch_maker(name);
			});
		});
	}
}
