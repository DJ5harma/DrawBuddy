import { Shape } from "../Shapes/Shape";
import { CanvasManager } from "./CanvasManager";

export class Camera {
    constructor(
        public canvas: HTMLCanvasElement[],
        public scale: number = 1,
        public offset: vec2 = [0, 0],
        public minScale: number = 0.1,
        public maxScale: number = 5
    ) {}

    applyTransform() {
        this.canvas.forEach((element) => {
            const ctx = element.getContext("2d")!;
            ctx.resetTransform();
            ctx.scale(this.scale, this.scale);
            ctx.translate(-this.offset[0], -this.offset[1]);
        });

        let shapes: Shape[] = CanvasManager.get_shapes();

        const ctx = this.canvas[1].getContext("2d")!;
        ctx.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height);
        shapes.forEach((shape) => {
            shape.render_me_whole(ctx);
        });
        console.log("Scale : ", this.scale);
        console.log("offset : ", this.offset);
    }

    screenToWorld(pos: vec2): vec2 {
        return [
            pos[0] / this.scale + this.offset[0],
            pos[1] / this.scale + this.offset[1],
        ];
    }

    worldToScreen(pos: vec2): vec2 {
        return [
            (pos[0] - this.offset[0]) * this.scale,
            (pos[1] - this.offset[1]) * this.scale,
        ];
    }
}
