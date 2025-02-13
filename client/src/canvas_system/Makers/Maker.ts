export abstract class Maker {
	protected mousedown(_: MouseEvent) {}

	protected mousemove(_: MouseEvent) {}

	protected mouseup(_: MouseEvent) {}

	public set_config(_config: { stroke: Stroke }) {}
	public start() {}
	public stop() {}

	public abstract ensure_bounding_rect(): void;
}
