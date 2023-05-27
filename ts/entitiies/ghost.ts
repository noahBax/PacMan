import { Entity } from "../entity.js";
import { GameBoard } from "../gameBoard.js";
import { spriteManager } from "../spriteManager.js";
import { Direction, RenderObject, boardCoordinate, canvasCoordinate, moveInfo as moveInfo, vector } from "../types.js";
import { PacMan } from "./pacman.js";

abstract class Ghost extends Entity {
	protected state: ("chase" | "scatter" | "frightened" | "eyes") = "chase"
	private _frightTimer = 0;
	private _frightStart = 0;

	protected __lastRecordedLocation: boardCoordinate = {bx: 0, by: 0}

	// Direction that won't be applied until we reach the center of the cell
	private _latentDirection: Direction = "right";
	private _moveProcessed = true;

	constructor(pacmanRef: PacMan) {
		super()
		this.__pacmanReference = pacmanRef;
	}
	
	updateFrame(frameNo: number): RenderObject {
		const progress = frameNo - this.__startTime;
		console.log("Progress", progress)

		// * Update frightened timer
		if (this.state == "frightened") {
			if (frameNo - this._frightStart >= this._frightTimer) {
				this.state = "chase";
			}
		}


		// Get current position on gameboard
		const currBoardPos = GameBoard.getPositionOnBoardGrid(this.getCurrentPosition(frameNo));
		console.log("Board Position", currBoardPos);
		
		
		// Check to see if we have moved a tile
		if (this.__lastRecordedLocation.bx !== currBoardPos.bx || this.__lastRecordedLocation.by !== currBoardPos.by) {
			console.log("Moved", true);
			
			// Update the record so we can perform the check next time
			this.__lastRecordedLocation = {...currBoardPos};

			// Do target stuff
			const bestPos = this._targetLogic(frameNo);
			console.log("Target block", bestPos);

			this._latentDirection = bestPos?.direction ?? "none";
			this._moveProcessed = false;
		
		}

		// Actually move, what we will do 99% of the time
		// Check to see if we are at the turning point
		
		if (!this._moveProcessed) {
			
			const currCanvasPos = this.getCurrentPosition(frameNo);
			let canProcessNow = false;
			switch (this.direction) {
				case "up":
					canProcessNow = currCanvasPos.cy % 16 <= 8;
					break;
				case "down":
					canProcessNow = currCanvasPos.cy % 16 > 8;
					break;
				case "left":
					canProcessNow = currCanvasPos.cy % 16 <= 8;
					break;
				case "right":
					canProcessNow = currCanvasPos.cy % 16 > 8;
				case "none":
					canProcessNow = true;
					// Idk when this'll happen so I want to know
					break;
			}

			if (canProcessNow) {
				this._moveProcessed = true;
				// Set startpos to current (rounded obviously)
				this.__startPosition = {
					cx: Math.round(currCanvasPos.cx / 16) * 16,
					cy: Math.round(currCanvasPos.cy / 16) * 16
				}

				// Update vector
				this.__currentVector = Ghost.getVectorFromDirection(this._latentDirection);

				// Update direction
				this.direction = this._latentDirection;
				// ToDo: Make it so that direction isn't updated til now. More faithful to original game
			}
		}


		// * Return coordinates with respect to canvas
		return {
			placementCoords: {
				cx: this.__startPosition.cx + this.__currentVector.x * progress,
				cy: this.__startPosition.cy + this.__currentVector.y * progress,
			},
			sheetCoords: this._imageDeterminer(frameNo)
		}
	}

	private _targetLogic(frameNo: number): moveInfo | undefined {
		let currBoardPos = GameBoard.getPositionOnBoardGrid(this.getCurrentPosition(frameNo));
		// Do target Logic
		const currTarget = this.getTarget();
		const forwardPosition = this.__getForwardBoardCoordinate(frameNo);
		console.log(forwardPosition)
		const legalMoves = GameBoard.getLegalMoves(forwardPosition);

		// Loop through to find which path we should take
		// Literally an implementation of greedy best first search
		let bestDistance = Infinity;
		let bestPos: moveInfo = legalMoves[0]
		legalMoves.forEach(move => {

			// Check to see if this is the square being ocupied
			if (move.coord.bx !== currBoardPos.bx && move.coord.by !== currBoardPos.by) {

				const distance = (currTarget.bx - move.coord.bx)**2 + (currTarget.by - move.coord.by)**2;
				if (distance < bestDistance) {
					bestDistance = distance;
					bestPos = move;
				}
			}
		});

		return bestPos;
	}

	/**
	 * Get the target tile, where the ghost is trying to get to
	 */
	abstract getTarget(): boardCoordinate;

	scareMe(frameTimer: number, currFrame: number) {
		this.state = "frightened";
		this._frightStart = currFrame;
		this._frightTimer = frameTimer;
	}

	private _imageDeterminer(frameNo: number): canvasCoordinate {
		if (this.state === "frightened") {
			const frightProgression = frameNo - this._frightStart;

			const indexName = (this._frightTimer - frightProgression <= 120) ? "ghostSkeptical" : "ghostFrightened";
			const animLength = spriteManager[indexName].length;
			const frameNumer = Math.floor(frightProgression / Entity._FRAMES_PER_IMAGE) % animLength

			
			return spriteManager[indexName][frameNumer];
		} else if (this.state === "eyes") {
			const progression = frameNo - this.__startTime;

			const indexName = "eyes";
			const animLength = spriteManager[indexName].length;
			const frameNumer = Math.floor(progression / Entity._FRAMES_PER_IMAGE) % animLength
		} else {
			const progression = frameNo - this.__startTime;

			const indexName = this.__animationInfo[this.direction];
			console.log(indexName, this.direction, this.__animationInfo);
			const animLength = spriteManager[indexName].length;
			const frameNumer = Math.floor(progression / Entity._FRAMES_PER_IMAGE) % animLength

			return spriteManager[indexName][frameNumer];
		}
	}

	protected __getForwardBoardCoordinate(frameNo: number): boardCoordinate {
		let currentHeading: vector = {...this.__currentVector};
		console.log("__getForwardBoard", currentHeading);
		let currentPos  = GameBoard.getPositionOnBoardGrid(this.getCurrentPosition(frameNo));
		if (currentHeading.x != 0) {
			if (currentHeading.x < 0) {
				currentPos.bx -= 1;
				return currentPos;
			} else {
				currentPos.bx += 1;
				return currentPos;
			}
		}
		if (currentHeading.y != 0) {
			if (currentHeading.y < 0) {
				currentPos.by -= 1;
				return currentPos;
			} else {
				currentPos.by += 1;
				return currentPos;
			}
		}
		// If for whatever reason we ain't moving, set to right
		return {bx: 0, by: 0};
	}

	static getVectorFromDirection(direction: Direction): vector {
		switch (direction) {
			case "up":
				return {x: 0, y: -PacMan.SPEED}
				break;
			case "down":
				return {x: 0, y: PacMan.SPEED}
				break;
			case "left":
				return {x: -PacMan.SPEED, y: 0}
				break;
			case "right":
				return {x: PacMan.SPEED, y: 0}
				break;
			default:
				return {x: 0, y: 0}
		}
	}
}


export { Ghost }