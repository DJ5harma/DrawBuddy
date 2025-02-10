import ShapeMakerManager from "../../canvas_system/ShapeMakerManager/ShapeMakerManager";

export default class ToolSelector {
	static tool_names: Tools[];

	static init() {
		this.tool_names = ["RECTANGLE", "PENCIL"];

		console.log("toolSelector ui init");
		const toolSelector =
			document.querySelector<HTMLDivElement>("#tool_selector")!;

		toolSelector.addEventListener("mousedown", (e) => {
			e.stopPropagation();
		});

		const style = toolSelector.style;

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
			toolSelector.appendChild(elem);

			const { style } = elem;

			style.border = "solid cyan";
			style.borderRadius = "20px";
			style.padding = "10px";
			style.color = "white";

			elem.innerText = name;
			elem.innerHTML = name;

			elem.addEventListener("click", (_) => {
				console.log(name, "clicked");
				ShapeMakerManager.switch_maker(name);
			});
		});
	}
}
