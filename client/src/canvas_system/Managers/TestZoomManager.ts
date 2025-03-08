import { buffer_ctx, ctx } from "../../main";

export class TestZoomManager {
    static init() {
        console.log("test zoom manager");
        window.addEventListener("wheel", this.handleWheel, { passive: false });
    }

    private static handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey) e.preventDefault();

        // buffer_ctx.clearRect(
        //     0,
        //     0,
        //     buffer_ctx.canvas.width,
        //     buffer_ctx.canvas.height
        // );
        // buffer_ctx.drawImage(ctx.canvas, 0, 0);

        // ctx.scale(ctx.canvas.);
        // ctx.drawImage(ctx.canvas, )
    };
}
