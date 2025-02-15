// global.d.ts
export {}; // Ensure this is a module

declare global {
    type vec2 = [number, number];
    var vec2: vec2;

    type ResizeHandle = "n" | "e" | "s" | "w" | "ne" | "nw" | "se" | "sw";

    type Tools =
        | "RECTANGLE"
        | "PENCIL"
        | "CIRCLE"
        | "LINE"
        | "SELECTION"
        | "CANVAS-DRAGGER";
    var Tools = Tools;

    type Stroke = { width: number; color: Color };
    var Stroke = Stroke;

    type Color =
        | `rgba(${number}, ${number}, ${number}, ${number})`
        | `rgb(${number}, ${number}, ${number})`;
    var Color = Color;

    type BoundingRect = {
        top_left: vec2;
        bottom_right: vec2;
    };

    // interface Rectangle {
    // 	name: "RECTANGLE";
    // 	src: vec2;
    // 	dims: vec2;
    // }
    // var Rectangle: Rectangle;

    // type Shape = Rectangle | number;

    // var Shape: Shape;
}
