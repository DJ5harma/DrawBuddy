import { sharebutton } from "./Tools/ShareButton/shareButton";
import { ToolPallete } from "./Tools/ToolPallete/ToolPallete";
import { ToolSelector } from "./Tools/ToolSelector/ToolSelector";

export default function init_ui_system() {
    ToolSelector.init();
    ToolPallete.init();
    sharebutton.init();
}
