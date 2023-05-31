import { DevMode } from "./devmode.js";
import { Entity } from "./entity.js";
import { GameBoard } from "./gameBoard.js";
import { devMode } from "./index.js";
import { Renderer } from "./renderer.js";

class Animator {
	private renderer: Renderer;
	private entityList: Entity[] = [];
	private prevFrameTime = 0;
	private mazeFinishedDrawing = false;
	private dotsFinishedDrawing = false;

	private gameBoard: GameBoard;
	
	static CURRENT_FRAME_NO = 0;
	static ACTIVE = true;

	constructor(foreground_ctx: CanvasRenderingContext2D, background_ctx: CanvasRenderingContext2D, spriteSheet: HTMLImageElement | HTMLCanvasElement, gameBoard: GameBoard) {
		this.renderer = new Renderer(foreground_ctx, background_ctx, spriteSheet);
		this.gameBoard = gameBoard;
		this.gameBoard.setRenderer(this.renderer);
	}

	registerEntity(entity: Entity) {
		this.entityList.push(entity);
	}

	startUpAnimation() {
		if (Animator.ACTIVE) window.requestAnimationFrame(this.handleFrame.bind(this));
		// Animator.ACTIVE = true;
	}

	private handleFrame(timestamp: number) {

		if (!Animator.ACTIVE) return;

		// * Do time business logic yadayada
		if (timestamp - this.prevFrameTime < 1000/60) {
			window.requestAnimationFrame(this.handleFrame.bind(this));
			return;
		}
		Animator.CURRENT_FRAME_NO++;
		this.prevFrameTime = timestamp;

		// * Draw maze at the beginning
		if (!this.mazeFinishedDrawing) this.mazeFinishedDrawing = this.gameBoard.drawMaze(5000);//Animator.CURRENT_FRAME_NO);
		if (!this.dotsFinishedDrawing) this.dotsFinishedDrawing = this.gameBoard.drawDots(5000);//Animator.CURRENT_FRAME_NO);

		// * Draw each entity and cause them to update
		this.entityList.forEach(entity => {
			const renderObj = entity.updateFrame(Animator.CURRENT_FRAME_NO);
			this.renderer.drawForeground(renderObj);
		});

		if (DevMode.IN_DEV_MODE) {
			devMode.updateFrameRate(timestamp);
			devMode.updateTargets();
			devMode.updatePanelLocs();
		}

		this.renderer.renderForeground(Animator.CURRENT_FRAME_NO);


		window.requestAnimationFrame(this.handleFrame.bind(this));

	}



}

export { Animator }