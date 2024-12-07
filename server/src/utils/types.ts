export interface IPeers {
	[userid: string]: {
		username: string;
		usercolor: string;
	};
}

export interface IPoint {
	x: number;
	y: number;
}

export interface IElement {
	shape: {
		key: string;
		props: Object;
		name: string;
	};
	stagePos: IPoint;
	stageScale: number;
}

export type IElementsMap = Map<string, IElement>;
