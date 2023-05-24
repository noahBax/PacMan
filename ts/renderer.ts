class Renderer {
	static CANVAS: HTMLCanvasElement;
	static gl: WebGLRenderingContext;

	static init(canvas: HTMLCanvasElement) {
		Renderer.CANVAS = canvas;
		Renderer.gl = canvas.getContext("webgl");
	}
}