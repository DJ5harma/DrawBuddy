export abstract class Shape {
	getCopy: () => Shape = () => this; // not this, but copy
	prepare_for_render() {}
	render_me_whole() {}
}
