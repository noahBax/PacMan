import { GameBoard } from "./gameBoard.js";
import { RenderObject } from "./types.js";

class Renderer {
	private width = 0;
	private height = 0;
	private foreground_ctx: CanvasRenderingContext2D;
	private background_ctx: CanvasRenderingContext2D;
	private spriteSheet: HTMLImageElement | HTMLCanvasElement;

	private foregroundDrawQueue: RenderObject[] = [];
	private backgroundDrawQueue: RenderObject[] = [];

	constructor(foreground_ctx: CanvasRenderingContext2D, background_ctx: CanvasRenderingContext2D, spriteSheet: HTMLImageElement | HTMLCanvasElement) {
		this.foreground_ctx = foreground_ctx;
		this.foreground_ctx.imageSmoothingEnabled = false;
		this.background_ctx = background_ctx;
		this.background_ctx.imageSmoothingEnabled = false;

		this.width = foreground_ctx.canvas.width;
		this.height = foreground_ctx.canvas.height;
		this.spriteSheet = spriteSheet;

		GameBoard.actualHeight = this.height;
		GameBoard.actualWidth = this.width;
	}

	drawForeground(renderObj: RenderObject) {
		this.foregroundDrawQueue.push(renderObj);
	}

	renderForeground(frameNo: number) {

		// Clear frame first
		this.foreground_ctx.clearRect(0, 0, this.width, this.height);

		// Next draw what is in the queue
		// console.log(this.foregroundDrawQueue);
		this.foregroundDrawQueue.forEach( item => {
			this.foreground_ctx.drawImage(this.spriteSheet, item.sheetCoords.cx, item.sheetCoords.cy, 16, 16, item.placementCoords.cx, item.placementCoords.cy, 16, 16);
		});

		this.foregroundDrawQueue = [];

	}

	drawBackground(renderObj: RenderObject) {
		this.backgroundDrawQueue.push(renderObj);
	}

	renderBackground(frameNo: number) {

		// Clear frame first
		this.background_ctx.clearRect(0, 0, this.width, this.height);

		// Next draw what is in the queue
		this.backgroundDrawQueue.forEach( item => {
			this.background_ctx.drawImage(this.spriteSheet, item.sheetCoords.cx, item.sheetCoords.cy, 16, 16, item.placementCoords.cx, item.placementCoords.cy, 16, 16);
		});

		this.backgroundDrawQueue = [];
	}

	paintBackground(renderObj: RenderObject) {
		this.background_ctx.drawImage(this.spriteSheet, renderObj.sheetCoords.cx, renderObj.sheetCoords.cy, 16, 16, renderObj.placementCoords.cx, renderObj.placementCoords.cy, 16, 16);
	}
}


export { Renderer as Renderer };