import { Animator } from "./animator.js";
import { Blinky } from "./entitiies/blinky.js";
import { Clyde } from "./entitiies/clyde.js";
import { Inky } from "./entitiies/inky.js";
import { PacMan } from "./entitiies/pacman.js";
import { Pinky } from "./entitiies/pinky.js";
import { GameBoard } from "./gameBoard.js";
import { GridCell, RenderObject } from "./types.js";

class DevMode {

	private static readonly GRID_CELL_CLASS = "gridCellClass";
	private static readonly TARGET_CELL_CLASS = "targetTile";

	static IN_DEV_MODE = true;

	private dev_ctx: CanvasRenderingContext2D;

	private _gridRendered = false;
	private _cachedGrid: HTMLCanvasElement;
	private _cellCollection: HTMLDivElement;
	private _gridCells: GridCell[][] = [];
	
	private _pacman: PacMan;
	private _blinky: Blinky;
	private _inky: Inky;
	private _pinky: Pinky;
	private _clyde: Clyde;
	private _animator: Animator;
	private _gameBoard: GameBoard;

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
		this._cellCollection = document.createElement("div");
		this._cellCollection.id = "numberBox";

		for (let i = 0; i < 4; i++) {
			let t = document.createElement("div") as GridCell;
			t.classList.add("targetTileCover");
			t.dataset.boardX = "" + 0;
			t.dataset.boardY = "" + 0;
			t.dataset.canvasX = "" + 0;
			t.dataset.canvasY = "" + 0;
			this._targetTileCollection.push(t);
		}

	}

	renderGridTiles() {

		document.getElementById("easel").appendChild(this._cellCollection);
		this._tempCanvas.width = 16;
		this._tempCanvas.height = 16;
		this._temp_ctx.setLineDash([2,2]);
		this._temp_ctx.lineWidth = 1;
		
		const leftMoveValue = this._cellCollection.getBoundingClientRect().width / GameBoard.width;//GameBoard.width;
		const topMoveValue = this._cellCollection.getBoundingClientRect().height / GameBoard.height;//GameBoard.height;

		const topOffsetDistance = window.scrollY + this._cellCollection.getBoundingClientRect().top;
		const leftOffsetDistance = window.scrollX + this._cellCollection.getBoundingClientRect().left;
		
		this._temp_ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
		this._temp_ctx.moveTo(0,16);
		this._temp_ctx.lineTo(0,0);
		this._temp_ctx.lineTo(16,0);
		this._temp_ctx.stroke();
		for (let i = 0; i < GameBoard.height; i++) {
			this._gridCells.push([]);
			for (let j = 0; j < GameBoard.width; j++) {
				// Create teh GridCell element
				const num: GridCell = document.createElement("div");
				this._cellCollection.appendChild(num);
				this._gridCells[i].push(num);
				
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
				num.dataset.canvasX = topOffsetDistance + i*topMoveValue + "px";
				num.dataset.canvasY = leftOffsetDistance + j*leftMoveValue + "px";

				// Add event listeners
				num.addEventListener("mouseenter", this._displayGridCoord);
				num.addEventListener("mouseleave", this._dismissGridCoord);

				
			}
		}

		this._temp_ctx.clearRect(0, 0, 16, 16);
		this._temp_ctx.setLineDash([]);
	}

	updateTargets() {

		// First get Blinky
		let target = this._blinky.knownTargetLocation;
		let temp = this._targetTileCollection[0].dataset;
		if (parseInt(temp.boardX) !== target.bx || parseInt(temp.boardY) !== target.by) {
			// Remove current class from target tile
			let t = (this._gridCells[parseInt(temp.boardY)][parseInt(temp.boardX)]);
			t.classList.remove(DevMode.TARGET_CELL_CLASS);
			
			// Grab the dataset of our targetCell
			let index = (this._gridCells[target.by][target.bx]);
			// Use it's info to set the information of our target-location-cell
			temp.boardX = "" + target.bx
			temp.boardY = "" + target.by
			temp.canvasX = index.dataset.canvasX;
			temp.canvasY = index.dataset.canvasY;

			// Now add the appropriate class to the new target tile
			index.classList.add(DevMode.TARGET_CELL_CLASS);

		}

		// Inky
		target = this._inky.knownTargetLocation;
		temp = this._targetTileCollection[1].dataset;
		if (parseInt(temp.boardX) !== target.bx || parseInt(temp.boardY) !== target.by) {
			// Remove current class from target tile
			let t = (this._gridCells[parseInt(temp.boardY)][parseInt(temp.boardX)]);
			t.classList.remove(DevMode.TARGET_CELL_CLASS);
			
			// Grab the dataset of our targetCell
			let index = (this._gridCells[target.by][target.bx]);
			console.log(index, target, target.by, target.bx);
			// Use it's info to set the information of our target-location-cell
			temp.boardX = "" + target.bx
			temp.boardY = "" + target.by
			temp.canvasX = index.dataset.canvasX;
			temp.canvasY = index.dataset.canvasY;

			// Now add the appropriate class to the new target tile
			index.classList.add(DevMode.TARGET_CELL_CLASS);
			
		}

		// Pinky
		target = this._pinky.knownTargetLocation;
		temp = this._targetTileCollection[2].dataset;
		if (parseInt(temp.boardX) !== target.bx || parseInt(temp.boardY) !== target.by) {
			// Remove current class from target tile
			let t = (this._gridCells[parseInt(temp.boardY)][parseInt(temp.boardX)]);
			t.classList.remove(DevMode.TARGET_CELL_CLASS);
			
			// Grab the dataset of our targetCell
			let index = (this._gridCells[target.by][target.bx]);
			// Use it's info to set the information of our target-location-cell
			temp.boardX = "" + target.bx
			temp.boardY = "" + target.by
			temp.canvasX = index.dataset.canvasX;
			temp.canvasY = index.dataset.canvasY;

			// Now add the appropriate class to the new target tile
			index.classList.add(DevMode.TARGET_CELL_CLASS);
			
		}

		// Clyde
		target = this._clyde.knownTargetLocation;
		temp = this._targetTileCollection[3].dataset;
		if (parseInt(temp.boardX) !== target.bx || parseInt(temp.boardY) !== target.by) {
			// Remove current class from target tile
			let t = (this._gridCells[parseInt(temp.boardY)][parseInt(temp.boardX)]);
			t.classList.remove(DevMode.TARGET_CELL_CLASS);
			
			// Grab the dataset of our targetCell
			let index = (this._gridCells[target.by][target.bx]);
			// Use it's info to set the information of our target-location-cell
			temp.boardX = "" + target.bx
			temp.boardY = "" + target.by
			temp.canvasX = index.dataset.canvasX;
			temp.canvasY = index.dataset.canvasY;

			// Now add the appropriate class to the new target tile
			index.classList.add(DevMode.TARGET_CELL_CLASS);
			
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
		document.getElementById("tileLocation").textContent = `Location: [${cell.dataset.boardY}, ${cell.dataset.boardX}]`
	}
	
	private _dismissGridCoord(event: MouseEvent) {
		if (!(event.relatedTarget as HTMLElement)?.classList.contains(DevMode.GRID_CELL_CLASS)) {
			document.getElementById("tileLocation").textContent = `Location: None`
			
		}
	}
}

export { DevMode };