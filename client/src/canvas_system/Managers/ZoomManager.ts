import { Camera } from "./Camera";

export class ZoomManager {

    constructor(private readonly camera: Camera) {
        this.init();
    }

    private init() {
        console.log("Initializing ZoomManager with wheel zoom");
        window.addEventListener("wheel", this.handleWheel, { passive: false });
    }

    private handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey) {
            console.log("Disabling");
            e.preventDefault();
    
            const oldScale = this.camera.scale;
            const zoomSensitivity = 0.005;
            const newScale = Math.min(
                Math.max(oldScale * Math.exp(-e.deltaY * zoomSensitivity), this.camera.minScale),
                this.camera.maxScale
            );
    
            const rect = this.camera.canvas[1].getBoundingClientRect();
            const pointer: vec2 = [e.clientX - rect.left, e.clientY - rect.top];
    
            this.camera.offset = [
                this.camera.offset[0] + pointer[0] * (1 / oldScale - 1 / newScale),
                this.camera.offset[1] + pointer[1] * (1 / oldScale - 1 / newScale)
            ];
    
            this.camera.scale = newScale;
            this.camera.applyTransform();
        }
    };
    

    destroy() {
        window.removeEventListener("wheel", this.handleWheel);
    }
}
