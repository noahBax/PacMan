import { DevMode } from "./devmode.js";
import { PacMan } from "./entitiies/pacman.js";
import { Entity } from "./entity.js";
import { GameBoard } from "./gameBoard.js";
import { Renderer } from "./renderer.js";

class Animator {
	private _renderer: Renderer;
	private _entityList: Entity[] = [];
	private _prevFrameTime = 0;
	private _mazeFinishedDrawing = false;
	private _dotsFinishedDrawing = false;
	private _pacmanRef: PacMan;

	private _pauseTime = 0;

	private _gameBoard: GameBoard;
	
	static CURRENT_FRAME_NO = 0;
	static ACTIVE = true;
	static IN_SLOW_DOWN = false;
	static slowdownSpeed = 18;

	constructor(foreground_ctx: CanvasRenderingContext2D, background_ctx: CanvasRenderingContext2D, spriteSheet: HTMLImageElement | HTMLCanvasElement, gameBoard: GameBoard) {
		this._renderer = new Renderer(foreground_ctx, background_ctx, spriteSheet);
		this._gameBoard = gameBoard;
		this._gameBoard.setRenderer(this._renderer);
	}

	registerEntity(entity: Entity) {
		this._entityList.push(entity);
		if (entity instanceof PacMan) this._pacmanRef = entity;
	}

	startAnimating() {
		if (Animator.ACTIVE) window.requestAnimationFrame(this.handleFrame.bind(this));
		// Animator.ACTIVE = true;
	}

	private handleFrame(timestamp: number) {

		if (!Animator.ACTIVE) {
			this._pauseTime += (timestamp - this._prevFrameTime);
			this._prevFrameTime = timestamp;
			window.requestAnimationFrame(this.handleFrame.bind(this));
			return;
		}
		
		// console.log(this._pauseTime, timestamp - this._pauseTime);

		Animator.CURRENT_FRAME_NO++;

		this._prevFrameTime = timestamp;
		timestamp -= this._pauseTime;


		// * Draw maze at the beginning
		if (!this._mazeFinishedDrawing) this._mazeFinishedDrawing = this._gameBoard.drawMaze(5600);//Animator.CURRENT_FRAME_NO);
		if (!this._dotsFinishedDrawing) this._dotsFinishedDrawing = this._gameBoard.drawDots(5600);//Animator.CURRENT_FRAME_NO);

		// * Draw each entity and cause them to update
		this._entityList.forEach(entity => {
			// console.log(entity.PET_NAME);
			const renderObj = entity.updateFrame(timestamp);//Animator.CURRENT_FRAME_NO);
			// console.log(renderObj)
			this._renderer.drawForeground(renderObj);
		});

		this._gameBoard.tryToEatDot(timestamp, this._pacmanRef.recordedBoardPosition);

		// Todo: Use a developer variable
		if (DevMode.IN_DEV_MODE) {
			window.developer.updateFrameRate(timestamp);
			// window.developer.updateTargets();
			window.developer.updatePanelLocs(timestamp);
			window.developer.updateScore();
		}

		this._renderer.renderForeground(timestamp);
		this._renderer.renderBackground(timestamp);


		window.requestAnimationFrame(this.handleFrame.bind(this));

	}



}

export { Animator }