import { ReactNode } from "react";

export interface ITool {
	name:
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
		| "Eraser"
		| "ClearAll";

	icon: ReactNode;
	handler: ReactNode | null;
}
export interface IToolSettings {
	strokeColor: string;
	backgroundColor: string;
	strokeWidth: number;
	opacity: number;
	dashGap: number;
}
export interface IPeerMousePositions {
	[userid: string]: { x: number; y: number };
}
export interface IPeers {
	[userid: string]: {
		username: string;
		tempElement: JSX.Element | null;
		usercolor: string;
	};
}

export interface IPoint {
	x: number;
	y: number;
}