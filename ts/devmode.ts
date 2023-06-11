import { Animator } from "./animator.js";
import { Blinky } from "./entitiies/blinky.js";
import { Clyde } from "./entitiies/clyde.js";
import { Ghost } from "./entitiies/ghost.js";
import { Inky } from "./entitiies/inky.js";
import { PacMan } from "./entitiies/pacman.js";
import { Pinky } from "./entitiies/pinky.js";
import { GameBoard } from "./gameBoard.js";
import { unpackCoords } from "./index.js";
import { GridCell, RenderObject } from "./types.js";

class DevMode {

	private static readonly GRID_CELL_CLASS = "gridCellClass";
	private static readonly TARGET_CELL_CLASS = "targetTile";

	private frameRateBuffer = [0,0,0,0,0,0,0];
	private frbIndex = 0;
	private lastTimeOfFrame = 0;
	private frameRateElement: HTMLSpanElement;

	static IN_DEV_MODE = true;

	private dev_ctx: CanvasRenderingContext2D;

	private _gridRendered = false;
	private _cachedGrid: HTMLCanvasElement;
	private _cellCollectionEle: HTMLDivElement;
	private _gridCells: GridCell[][] = [];
	
	private _pacman: PacMan;
	private _blinky: Blinky;
	private _inky: Inky;
	private _pinky: Pinky;
	private _clyde: Clyde;
	private _animator: Animator;
	private _gameBoard: GameBoard;

	private _ghosts: Ghost[];
	private readonly _panelLocationIDs = ["blinkyLoc", "inkyLoc", "pinkyLoc", "clydeLoc"];
	private readonly _panelTargetIDs = ["blinkyTarget", "inkyTarget", "pinkyTarget", "clydeTarget"];
	private readonly _ghostColors = ["#ff0000", "#00ffff", "#FCB5FF", "#F8BB55"];

	private _spriteSheet: HTMLCanvasElement | HTMLImageElement
	private _tempCanvas: HTMLCanvasElement;
	private _temp_ctx: CanvasRenderingContext2D;
	private _targetTileCollection: GridCell[] = [];

	constructor(dev_ctx: CanvasRenderingContext2D, pacman: PacMan, blinky: Blinky, inky: Inky, pinky: Pinky, clyde: Clyde, animator: Animator, spriteSheet: HTMLImageElement | HTMLCanvasElement, gameBoard: GameBoard) {
		this.dev_ctx = dev_ctx;

		this._pacman = pacman;
		this._blinky = blinky;
		this._inky = inky;
		this._pinky = pinky;
		this._clyde = clyde;
		this._animator = animator;
		this._gameBoard = gameBoard;
		
		this._spriteSheet = spriteSheet;
		this._tempCanvas = document.createElement("canvas");
		this._temp_ctx = this._tempCanvas.getContext("2d");
		
		this._cachedGrid = document.createElement("canvas");
		this._temp_ctx = this._tempCanvas.getContext("2d");
		this._cellCollectionEle = document.createElement("div");
		this._cellCollectionEle.id = "cellBox";

		this.frameRateElement = document.getElementById("frameRate");

		for (let i = 0; i < 4; i++) {
			let t = document.createElement("div") as GridCell;
			t.classList.add("targetTileCover");
			t.dataset.boardX = "" + 0;
			t.dataset.boardY = "" + 0;
			t.dataset.canvasX = "" + 0;
			t.dataset.canvasY = "" + 0;
			t.style.backgroundColor = this._ghostColors[i];
			this._targetTileCollection.push(t);
			this._cellCollectionEle.appendChild(t);
			
		}

		this._ghosts = [this._blinky, this._inky, this._pinky, this._clyde];

	}

	renderGridTiles() {

		document.getElementById("easel").appendChild(this._cellCollectionEle);
		this._tempCanvas.width = 16;
		this._tempCanvas.height = 16;
		this._temp_ctx.setLineDash([2,2]);
		this._temp_ctx.lineWidth = 1;
		
		const leftMoveValue = this._cellCollectionEle.getBoundingClientRect().width / GameBoard.width;//GameBoard.width;
		const topMoveValue = this._cellCollectionEle.getBoundingClientRect().height / GameBoard.height;//GameBoard.height;

		const topOffsetDistance = window.scrollY + this._cellCollectionEle.getBoundingClientRect().top;
		const leftOffsetDistance = window.scrollX + this._cellCollectionEle.getBoundingClientRect().left;

		// Take care of the cover tiles first
		for (let i = 0; i < 4; i++) {
			let t = this._targetTileCollection[i];
			t.style.width = leftMoveValue + "px";
			t.style.height = topMoveValue + "px";
		}
		
		this._temp_ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
		this._temp_ctx.moveTo(0,16);
		this._temp_ctx.lineTo(0,0);
		this._temp_ctx.lineTo(16,0);
		this._temp_ctx.stroke();
		for (let i = 0; i < GameBoard.height; i++) {
			this._gridCells.push([]);
			for (let j = 0; j < GameBoard.width; j++) {
				// Create teh GridCell element
				const num = document.createElement("div") as GridCell;
				
				// Put a copy of the grid cell onto the dev canvas
				this._paintDeveloper({placementCoords: {cx: j*16, cy: i*16}, sheetCoords: {cx: 0, cy: 0}}, this._tempCanvas);
				
				// Add appropriate class
				num.classList.add(DevMode.GRID_CELL_CLASS);
				
				// Move to correct location
				num.style.width = leftMoveValue + "px";
				num.style.height = topMoveValue + "px";
				num.style.top = topOffsetDistance + i*topMoveValue + "px";
				num.style.left = leftOffsetDistance + j*leftMoveValue + "px";
				
				num.dataset.boardX = "" + j;
				num.dataset.boardY = "" + i;
				num.dataset.canvasX = leftOffsetDistance + j*leftMoveValue + "px";
				num.dataset.canvasY = topOffsetDistance + i*topMoveValue + "px";
				
				// Add event listeners
				num.addEventListener("mouseenter", this._displayGridCoord);
				num.addEventListener("mouseleave", this._dismissGridCoord);
				
				
				this._cellCollectionEle.appendChild(num);
				this._gridCells[i].push(num);
			}
		}

		this._temp_ctx.clearRect(0, 0, 16, 16);
		this._temp_ctx.setLineDash([]);
	}

	updateFrameRate(time: number) {
		this.frameRateBuffer[this.frbIndex] = time - this.lastTimeOfFrame;
		this.lastTimeOfFrame = time;
		this.frbIndex = (this.frbIndex++) % 7; //this.frameRateBuffer.length
		this.frameRateElement.textContent = Math.round(1000 / this.frameRateBuffer.reduce((acc, curr) => acc + curr)) + " fps";
	}

	updateTargets() {

		const entities = [this._blinky, this._inky, this._pinky, this._clyde];
		for (let i = 0; i < 4; i++) {

			let targetTile = this._targetTileCollection[i];
			let target = entities[i].targetCoord;
			// console.log(entities[i].PET_NAME, target, this._gridCells[target.by]);
			let targetCellStats = this._gridCells[target.by][target.bx].dataset;

			// targetTile.style.position = "absolute";
			targetTile.style.left = targetCellStats.canvasX;
			targetTile.style.top = targetCellStats.canvasY;
			// console.log("drawn");
		}


	}

	updatePanelLocs(frameNo: number) {
		for (let i = 0; i < this._panelLocationIDs.length; i++) {
			let e = this._ghosts[i].getBoardCoordinates(frameNo);
			document.getElementById(this._panelLocationIDs[i]).textContent = `[${e.by}, ${e.bx}]`;

			e = this._ghosts[i].targetCoord;
			document.getElementById(this._panelTargetIDs[i]).textContent = unpackCoords(e);
		}
	}

	/**
	 * Paint onto the developer canvas
	 * @param renderObj Location of placement of graphics on canvas and coordinate on sheet
	 * @param image Use this for custom elements. If you use it ignore the sheet corrdinates on renderObject
	 */
	private _paintDeveloper(renderObj: RenderObject, image?: HTMLCanvasElement | HTMLImageElement, ctx?: CanvasRenderingContext2D) {
		if (!!image) {
			this.dev_ctx.drawImage(image, renderObj.placementCoords.cx, renderObj.placementCoords.cy)
			return;
		}
		this.dev_ctx.drawImage(this._spriteSheet, renderObj.sheetCoords.cx, renderObj.sheetCoords.cy, 16, 16, renderObj.placementCoords.cx, renderObj.placementCoords.cy, 16, 16);
	}

	private _displayGridCoord(event: MouseEvent) {
		const cell = event.target as GridCell;
		document.getElementById("tileLocation").textContent = `Selected Location: [${cell.dataset.boardY}, ${cell.dataset.boardX}]`
	}
	
	private _dismissGridCoord(event: MouseEvent) {
		if (!(event.relatedTarget as HTMLElement)?.classList.contains(DevMode.GRID_CELL_CLASS)) {
			document.getElementById("tileLocation").textContent = `Selected Location: None`
			
		}
	}
}

export { DevMode };