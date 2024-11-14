import { useState } from "react";
import { BiPencil } from "react-icons/bi";
import { FaMousePointer } from "react-icons/fa";
import { FaArrowRightLong, FaHand } from "react-icons/fa6";
import { FiCircle } from "react-icons/fi";
import { ImTextColor } from "react-icons/im";
import { LuDiamond, LuEraser, LuRectangleHorizontal } from "react-icons/lu";
import { MdOutlineHorizontalRule } from "react-icons/md";
import { RiGalleryLine } from "react-icons/ri";

type ISelectedTool =
	| "Pointer"
	| "Hand"
	| "Rectangle"
	| "Diamond"
	| "Circle"
	| "Arrow"
	| "Line"
	| "Pencil"
	| "Text"
	| "Gallery"
	| "Eraser";

export default function TopNav() {
	const [selected, setSelected] = useState<ISelectedTool>("Pointer");

	return (
		<div className="w-screen absolute top-4 left-0 flex justify-center items-center z-10">
			<nav className="top-2 bg-neutral-800 flex p-1 [&>button]:p-3 gap-1">
				<button
					onClick={() => {
						setSelected("Hand");
					}}
					className={` ${
						selected === "Hand" ? "bg-orange-900" : "hover:bg-neutral-700"
					}`}
				>
					<FaHand />
				</button>
				<button
					onClick={() => {
						setSelected("Pointer");
					}}
					className={` ${
						selected === "Pointer" ? "bg-orange-900" : "hover:bg-neutral-700"
					}`}
				>
					<FaMousePointer />
				</button>
				<button
					onClick={() => {
						setSelected("Rectangle");
					}}
					className={` ${
						selected === "Rectangle" ? "bg-orange-900" : "hover:bg-neutral-700"
					}`}
				>
					<LuRectangleHorizontal />
				</button>
				<button
					onClick={() => {
						setSelected("Diamond");
					}}
					className={` ${
						selected === "Diamond" ? "bg-orange-900" : "hover:bg-neutral-700"
					}`}
				>
					<LuDiamond />
				</button>
				<button
					onClick={() => {
						setSelected("Circle");
					}}
					className={` ${
						selected === "Circle" ? "bg-orange-900" : "hover:bg-neutral-700"
					}`}
				>
					<FiCircle />
				</button>
				<button
					onClick={() => {
						setSelected("Arrow");
					}}
					className={` ${
						selected === "Arrow" ? "bg-orange-900" : "hover:bg-neutral-700"
					}`}
				>
					<FaArrowRightLong />
				</button>
				<button
					onClick={() => {
						setSelected("Line");
					}}
					className={` ${
						selected === "Line" ? "bg-orange-900" : "hover:bg-neutral-700"
					}`}
				>
					<MdOutlineHorizontalRule />
				</button>
				<button
					onClick={() => {
						setSelected("Pencil");
					}}
					className={` ${
						selected === "Pencil" ? "bg-orange-900" : "hover:bg-neutral-700"
					}`}
				>
					<BiPencil />
				</button>
				<button
					onClick={() => {
						setSelected("Text");
					}}
					className={` ${
						selected === "Text" ? "bg-orange-900" : "hover:bg-neutral-700"
					}`}
				>
					<ImTextColor />
				</button>
				<button
					onClick={() => {
						setSelected("Gallery");
					}}
					className={` ${
						selected === "Gallery" ? "bg-orange-900" : "hover:bg-neutral-700"
					}`}
				>
					<RiGalleryLine />
				</button>
				<button
					onClick={() => {
						setSelected("Eraser");
					}}
					className={` ${
						selected === "Eraser" ? "bg-orange-900" : "hover:bg-neutral-700"
					}`}
				>
					<LuEraser />
				</button>
			</nav>
		</div>
	);
}
