// global.d.ts
export {}; // Ensure this is a module

declare global {
	type vec2 = [number, number];
	var vec2: vec2;

	type Tools = "RECTANGLE" | "PENCIL";
	var Tools = Tools;

	type Stroke = { width: number; color: Color };
	var Stroke = Stroke;

	type Color =
		| `rgba(${number}, ${number}, ${number}, ${number})`
		| `rgb(${number}, ${number}, ${number})`;
	var Color = Color;

	// interface Rectangle {
	// 	name: "RECTANGLE";
	// 	src: vec2;
	// 	dims: vec2;
	// }
	// var Rectangle: Rectangle;

	// type Shape = Rectangle | number;

	// var Shape: Shape;
}
