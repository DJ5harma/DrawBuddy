import { canvases } from "../../../main";

export class CanvasDragger {
	static location: vec2 = [0, 0];

	static move_start_pos: vec2 = [0, 0];

	static move: boolean = false;

	static init() {
		console.log("CanvasDragger init");

		document.addEventListener("wheel", (e) => {
			const { deltaY } = e;

			const dir_multiple = deltaY < 0 ? 1 : -1;
			const displacement: vec2 = [0, dir_multiple * 50];

			this.location[1] += displacement[1];

			this.move_canvas();
			// console.log(this.location);
		});

		document.addEventListener("mousedown", (e) => {
			if (e.button !== 1) return;
			this.move_start_pos = [e.clientX, e.clientY];
			this.move = true;
		});

		document.addEventListener("mousemove", (e) => {
			if (!this.move) return;

			const displacement: vec2 = [
				e.clientX - this.move_start_pos[0],
				e.clientY - this.move_start_pos[1],
			];

			this.location[0] += displacement[0];
			this.location[1] += displacement[1];

			this.move_start_pos = [e.clientX, e.clientY];

			this.move_canvas();
		});

		document.addEventListener("mouseup", (e) => {
			if (e.button !== 1) return;
			this.move = false;
		});
	}

	static move_canvas() {
		console.log("movingg");

		canvases.forEach((cvs) => {
			cvs.style.left = this.location[0] + "px";
			cvs.style.top = this.location[1] + "px";
		});
	}

	static get_mouse_pos(e: MouseEvent): vec2 {
		return [e.clientX + this.location[0], e.clientY + this.location[1]];
	}

	static get_location(): vec2 {
		console.log("Canvas location = ", this.location);

		return this.location;
	}
}
