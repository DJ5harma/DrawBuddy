// global.d.ts
export {}; // Ensure this is a module

declare global {
	type vec2 = [number, number];
	var vec2: vec2;
}
