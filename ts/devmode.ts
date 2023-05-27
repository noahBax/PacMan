import { Animator } from "./animator.js";
import { Blinky } from "./entitiies/blinky.js";
import { Clyde } from "./entitiies/clyde.js";
import { Inky } from "./entitiies/inky.js";
import { PacMan } from "./entitiies/pacman.js";
import { Pinky } from "./entitiies/pinky.js";
import { GameBoard } from "./gameBoard.js";
import { RenderObject } from "./types.js";

class DevMode {

	private dev_ctx: CanvasRenderingContext2D;

	private gridRendered = false;
	private cachedGrid: HTMLCanvasElement;
	private cachedGrid_ctx: CanvasRenderingContext2D;
	private cachedNumbers: HTMLDivElement;
	
	private pacman: PacMan;
	private blinky: Blinky;
	private inky: Inky;
	private pinky: Pinky;
	private clyde: Clyde;
	private animator: Animator;
	private gameBoard: GameBoard;

	private spriteSheet: HTMLCanvasElement | HTMLImageElement
	private tempCanvas: HTMLCanvasElement;
	private temp_ctx: CanvasRenderingContext2D;

	constructor(dev_ctx: CanvasRenderingContext2D, pacman: PacMan, blinky: Blinky, inky: Inky, pinky: Pinky, clyde: Clyde, animator: Animator, spriteSheet: HTMLImageElement | HTMLCanvasElement, gameBoard: GameBoard) {
		this.dev_ctx = dev_ctx;

		this.pacman = pacman;
		this.blinky = blinky;
		this.inky = inky;
		this.pinky = pinky;
		this.clyde = clyde;
		this.animator = animator;
		this.gameBoard = gameBoard;
		
		this.spriteSheet = spriteSheet;
		this.tempCanvas = document.createElement("canvas");
		this.temp_ctx = this.tempCanvas.getContext("2d");
		
		this.cachedGrid = document.createElement("canvas");
		this.temp_ctx = this.tempCanvas.getContext("2d");
		this.cachedNumbers = document.createElement("div");
		this.cachedNumbers.id = "numberBox";

	}

	renderGridNumbers() {
		document.getElementById("easel").appendChild(this.cachedNumbers);
		this.tempCanvas.width = 16;
		this.tempCanvas.height = 16;
		this.temp_ctx.setLineDash([2,2]);
		
		const leftMoveValue = GameBoard.width / this.cachedNumbers.getBoundingClientRect().width;//GameBoard.width;
		const topMoveValue = GameBoard.height / this.cachedNumbers.getBoundingClientRect().height;//GameBoard.height;

		const topOffsetDistance = this.cachedNumbers.getBoundingClientRect().top;
		const leftOffsetDistance = this.cachedNumbers.getBoundingClientRect().left;
		
		this.temp_ctx.strokeStyle = 'white';
		for (let i = 0; i < GameBoard.height; i++) {
			for (let j = 0; j < GameBoard.width; j++) {
				this.temp_ctx.moveTo(0,16);
				this.temp_ctx.lineTo(0,0);
				this.temp_ctx.lineTo(16,0);
				this.temp_ctx.stroke();
				// this.temp_ctx.fillText(`${j}${i}`,8 ,8);
				this.paintDeveloper({placementCoords: {cx: j*16, cy: i*16}, sheetCoords: {cx: 0, cy: 0}}, this.tempCanvas);
				const num = document.createElement("p");
				this.cachedNumbers.appendChild(num);
				num.style.top = topOffsetDistance + i*topMoveValue + "px";
				num.style.left = leftOffsetDistance + j*leftMoveValue + "px";
				num.textContent = `${j}, ${i}`;
				
			}
		}
		
		this.temp_ctx.setLineDash([]);
	}

	/**
	 * Paint onto the developer canvas
	 * @param renderObj Location of placement of graphics on canvas and coordinate on sheet
	 * @param image Use this for custom elements. If you use it ignore the sheet corrdinates on renderObject
	 */
	private paintDeveloper(renderObj: RenderObject, image?: HTMLCanvasElement | HTMLImageElement, ctx?: CanvasRenderingContext2D) {
		if (!!image) {
			this.dev_ctx.drawImage(image, renderObj.placementCoords.cx, renderObj.placementCoords.cy)
			return;
		}
		this.dev_ctx.drawImage(this.spriteSheet, renderObj.sheetCoords.cx, renderObj.sheetCoords.cy, 16, 16, renderObj.placementCoords.cx, renderObj.placementCoords.cy, 16, 16);
	}
}

export { DevMode };