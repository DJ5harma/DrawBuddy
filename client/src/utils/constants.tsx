import { BiPencil } from "react-icons/bi";
import { FaMousePointer } from "react-icons/fa";
import { FaArrowRightLong, FaHand } from "react-icons/fa6";
import { FiCircle } from "react-icons/fi";
import { ImTextColor } from "react-icons/im";
import { LuDiamond, LuEraser, LuRectangleHorizontal } from "react-icons/lu";
import { MdOutlineDelete, MdOutlineHorizontalRule } from "react-icons/md";
import { RiGalleryLine } from "react-icons/ri";
import RectangleHandler from "../handlers/shape/RectangleHandler";
import CircleHandler from "../handlers/shape/CircleHandler";
import LineHandler from "../handlers/shape/LineHandler";
import ClearAllHandler from "../handlers/functional/ClearAllHandler";
import PencilHandler from "../handlers/shape/PencilHandler";
import { ITool } from "./types";

export const toolArr: ITool[] = [
	{
		name: "Hand",
		icon: <FaHand />,
		handler: <></>,
	},
	{
		name: "Pointer",
		icon: <FaMousePointer />,
		handler: <></>,
	},
	{
		name: "Rectangle",
		icon: <LuRectangleHorizontal />,
		handler: <RectangleHandler />,
	},
	{
		name: "Diamond",
		icon: <LuDiamond />,
		handler: <></>,
	},
	{
		name: "Circle",
		icon: <FiCircle />,
		handler: <CircleHandler />,
	},
	{
		name: "Arrow",
		icon: <FaArrowRightLong />,
		handler: <></>,
	},
	{
		name: "Line",
		icon: <MdOutlineHorizontalRule />,
		handler: <LineHandler />,
	},
	{
		name: "Pencil",
		icon: <BiPencil />,
		handler: <PencilHandler />,
	},
	{
		name: "Text",
		icon: <ImTextColor />,
		handler: <></>,
	},
	{
		name: "Gallery",
		icon: <RiGalleryLine />,
		handler: <></>,
	},
	{
		name: "Eraser",
		icon: <LuEraser />,
		handler: <></>,
	},
	{
		name: "ClearAll",
		handler: <ClearAllHandler />,
		icon: <MdOutlineDelete />,
	},
];

export const strokeColors = [
	"rgb(255,40,40)",
	"rgb(60,255,60)",
	"rgb(60,60,255)",
	"yellow",
	"orange",
	"",
];
export const backgroundColors = [
	"rgb(255, 201, 201)",
	"rgb(178, 242, 187)",
	"rgb(165, 216, 255)",
	"rgb(255, 236, 153)",
	"",
];

export const sampleToolSettings = {
	strokeColor: strokeColors[0],
	backgroundColor: backgroundColors[0],
	strokeWidth: 10,
	opacity: 1,
};
