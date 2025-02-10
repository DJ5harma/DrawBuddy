export interface Rectangle {
	src: vec2;
	end: vec2;
}

export type Shape = Rectangle;

export class Store {
	static arr: Shape[] = [];
}
