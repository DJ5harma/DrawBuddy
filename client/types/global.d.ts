// global.d.ts
export {}; // Ensure this is a module

declare global {
	type vec2 = [number, number];
	var vec2: vec2;

	// interface Rectangle {
	// 	name: "RECTANGLE";
	// 	src: vec2;
	// 	dims: vec2;
	// }
	// var Rectangle: Rectangle;

	// type Shape = Rectangle | number;

	// var Shape: Shape;
}
