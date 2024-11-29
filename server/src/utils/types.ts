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

export interface IShape {
	key: string;
	props: Object;
	name: string;
}

export interface IElement {
	shape: IShape;
	stagePos: IPoint;
	stageScale: number;
}
