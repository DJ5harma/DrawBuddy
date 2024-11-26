export interface IPeers {
	[userid: string]: {
		username: string;
		usercolor: string;
	};
}

export interface IElement {
	key: string;
	props: Object;
	name: string;
}
