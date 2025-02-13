import { SelectionManager } from "../../../canvas_system/Managers/SelectionManager";

export class ToolPallete {
	static tool_pallete: HTMLDivElement;

	static stroke: Stroke = {
		color: "rgb(255, 255, 255)",
		width: 3,
	};
	static fill: Color = "rgb(0, 0, 0)";

	static init() {
		this.tool_pallete =
			document.querySelector<HTMLDivElement>("#tool_pallete")!;
		const { style } = this.tool_pallete;

		style.position = "absolute";
		style.top = "0px";
		style.left = "0px";

		style.display = "flex";
		style.flexDirection = "column";
		style.paddingLeft = "20px";
		style.paddingRight = "20px";
		style.border = "solid white 1px";

		style.backgroundColor = "white";

		this.setup_stroke_colors_div();
		this.setup_background_colors_div();
		this.setup_stroke_width_bar();
	}

	private static setup_stroke_colors_div() {
		const stroke_label = document.createElement("p");
		stroke_label.textContent = "Stroke";
		stroke_label.style.color = "black";
		this.tool_pallete.appendChild(stroke_label);

		const stroke_div = document.createElement("div");

		const { style } = stroke_div;

		style.display = "flex";
		style.gap = "10px";
		style.justifyContent = "space_around";

		(
			[
				"rgb(30, 30, 30)",
				"rgb(224, 49, 49)",
				"rgb(47, 158, 68)",
				"rgb(25, 113, 194)",
				"rgb(240, 140, 0)",
				"rgb(255, 255, 255)",
			] as Color[]
		).forEach((color) => {
			const elem = document.createElement("button");
			elem.style.backgroundColor = color;
			elem.style.width = "30px";
			elem.style.height = "30px";
			elem.style.boxShadow = "0 0 1px 1px gray";
			elem.style.borderRadius = "5px";
			elem.style.cursor = "pointer";
			stroke_div.appendChild(elem);

			elem.addEventListener("click", (_) => {
				ToolPallete.stroke.color = color;
				SelectionManager.update_selected_shapes_from_pallete();
			});
		});

		this.tool_pallete.appendChild(stroke_div);
	}

	private static setup_background_colors_div() {
		const stroke_label = document.createElement("p");
		stroke_label.textContent = "Background";
		stroke_label.style.color = "black";
		this.tool_pallete.appendChild(stroke_label);

		const background_div = document.createElement("div");

		const { style } = background_div;

		style.display = "flex";
		style.gap = "10px";
		style.justifyContent = "space_around";

		(
			[
				"rgb(235, 235, 235)",
				"rgb(255, 201, 201)",
				"rgb(178, 242, 187)",
				"rgb(165, 216, 255)",
				"rgb(255, 236, 153)",
				"rgb(255, 255, 255)",
			] as Color[]
		).forEach((color) => {
			const elem = document.createElement("button");
			elem.style.backgroundColor = color;
			elem.style.width = "30px";
			elem.style.height = "30px";
			elem.style.boxShadow = "0 0 1px 1px gray";
			elem.style.borderRadius = "5px";
			elem.style.cursor = "pointer";
			background_div.appendChild(elem);

			elem.addEventListener("click", (_) => {
				ToolPallete.fill = color;
				SelectionManager.update_selected_shapes_from_pallete();
			});
		});

		this.tool_pallete.appendChild(background_div);
	}

	private static setup_stroke_width_bar() {
		const stroke_label = document.createElement("p");
		stroke_label.textContent = "Stroke width";
		stroke_label.style.color = "black";
		this.tool_pallete.appendChild(stroke_label);

		const bar_div = document.createElement("div");
		bar_div.style.width = "100%";

		bar_div.innerHTML = /*html*/ `
		<input id="stroke_width_bar" type="range" min="1" max="10" value="3" />
        `;

		const elem = document.querySelector<HTMLInputElement>("#stroke_width_bar")!;
		elem.style.width = "100%";
		elem.style.height = "30px";
		elem.style.cursor = "pointer";

		this.stroke.width = parseInt(elem.value, 10);

		elem.addEventListener("input", (_) => {
			ToolPallete.stroke.width = parseInt(elem.value, 10);
			SelectionManager.update_selected_shapes_from_pallete();
		});

		this.tool_pallete.appendChild(bar_div);
	}
}
