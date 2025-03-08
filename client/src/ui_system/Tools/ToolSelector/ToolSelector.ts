import { SelectionMaker } from "../../../canvas_system/Makers/SelectionMaker";

const maker_names: Tools[] = ["PENCIL", "RECTANGLE", "CIRCLE", "LINE"];
const selection_tool_name: Tools = "SELECTION";
const canvas_dragger_tool_name: Tools = "CANVAS-DRAGGER";

export class ToolSelector {
    private static tool_selector: HTMLDivElement;

    public static selected_tool: Tools;

    public static init() {
        this.tool_selector =
            document.querySelector<HTMLDivElement>("#tool_selector")!;

        this.selected_tool = "RECTANGLE";

        this.setup_canvas_dragger();
        this.setup_selection_maker();
        this.setup_drawers();
    }

    private static style_btn(elem: HTMLButtonElement) {
        const { style } = elem;
        style.border = "solid cyan";
        style.borderRadius = "20px";
        style.padding = "10px";
        style.color = "black";
    }

    private static setup_selection_maker() {
        const elem = document.createElement("button");
        this.tool_selector.appendChild(elem);

        this.style_btn(elem);

        elem.innerText = selection_tool_name;

        elem.addEventListener("click", (_) => {
            SelectionMaker.curr.fill = "rgba(163, 163, 242, 0.1)";
            SelectionMaker.curr.stroke = {
                color: "rgba(100, 100, 242, 1)",
                width: 2,
            };

            console.log(selection_tool_name, "clicked");
            this.selected_tool = selection_tool_name;
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
            this.selected_tool = canvas_dragger_tool_name;
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

        maker_names.forEach((name) => {
            const elem = document.createElement("button");
            this.tool_selector.appendChild(elem);

            this.style_btn(elem);

            elem.innerText = name;

            elem.addEventListener("click", (_) => {
                console.log(name, "clicked");
                this.selected_tool = name;
            });
        });
    }
}
