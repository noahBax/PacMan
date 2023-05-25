import { Entity } from "./entity.js";
import { GameBoard } from "./gameBoard.js";
import { Renderer } from "./renderer.js";

class Animator {
	private renderer: Renderer;
	private entityList: Entity[] = [];
	private prevFrameTime = 0;
	private mazeFinishedDrawing = false;
	private dotsFinishedDrawing = false;

	private gameBoard: GameBoard;
	
	static CURRENT_FRAME_NO = 0;

	constructor(foreground_ctx: CanvasRenderingContext2D, background_ctx: CanvasRenderingContext2D, spriteSheet: HTMLImageElement | HTMLCanvasElement, gameBoard: GameBoard) {
		this.renderer = new Renderer(foreground_ctx, background_ctx, spriteSheet);
		this.gameBoard = gameBoard;
		this.gameBoard.setRenderer(this.renderer);
		window.requestAnimationFrame(this.handleFrame.bind(this));
	}

	registerEntity(entity: Entity) {
		this.entityList.push(entity);
	}

	handleFrame(timestamp: number) {
		if (timestamp - this.prevFrameTime < 1000/60) {
			window.requestAnimationFrame(this.handleFrame.bind(this));
			return;
		}
		Animator.CURRENT_FRAME_NO++;
		this.prevFrameTime = timestamp;

		if (!this.mazeFinishedDrawing) this.mazeFinishedDrawing = this.gameBoard.drawMaze(Animator.CURRENT_FRAME_NO);
		if (!this.dotsFinishedDrawing) this.dotsFinishedDrawing = this.gameBoard.drawDots(Animator.CURRENT_FRAME_NO);

		this.entityList.forEach(entity => {
			const renderObj = entity.updateFrame(Animator.CURRENT_FRAME_NO);
			this.renderer.drawForeground(renderObj);
		});

		this.renderer.renderForeground(Animator.CURRENT_FRAME_NO);


		window.requestAnimationFrame(this.handleFrame.bind(this));

	}

}

export { Animator }