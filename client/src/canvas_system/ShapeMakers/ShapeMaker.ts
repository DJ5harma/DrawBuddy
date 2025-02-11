export default abstract class ShapeMaker {
	protected mousedown(_: MouseEvent) {}

	protected mousemove(_: MouseEvent) {}

	protected mouseup(_: MouseEvent) {}

	public set_config(_config: { stroke: Stroke }) {}
	public start() {}
	public stop() {}
}
