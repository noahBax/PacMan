import { Entity } from "../entity.js";
import { GameBoard } from "../gameBoard.js";
import { spriteManager } from "../spriteManager.js";
import { Direction, GridCell, RenderObject, boardCoordinate, canvasCoordinate, moveInfo as moveInfo, vector } from "../types.js";
import { PacMan } from "./pacman.js";

abstract class Ghost extends Entity {
	protected state: ("chase" | "scatter" | "frightened" | "eyes") = "chase"
	private _frightTimer = 0;
	private _frightStart = 0;

	knownPreviousLocation: boardCoordinate = {by: 0, bx: 0}
	knownCurrentLocation: boardCoordinate = {by: 0, bx: 0}
	knownTargetLocation: boardCoordinate = {by: 0, bx: 0};
	// This current location is public
	
	protected abstract __currentLocation: boardCoordinate;
	protected abstract __startPositionForVector: canvasCoordinate;

	// Direction that won't be applied until we reach the center of the cell
	private _latentDirection: Direction = "right";
	private _moveProcessed = true;
	protected __turningLocation: boardCoordinate;

	constructor(pacmanRef: PacMan) {
		super()
		this.__pacmanReference = pacmanRef;
	}

	initializeGhost() {
		/**
		 * What do we know at this point
		 * - We know the start of our vector
		 * - Our board position
		 * - Our direction
		 * - by extension or vector
		 */
		
		// So first let's do finding the path to the target
		this._moveProcessed = false;
		this.knownPreviousLocation = {...this.__currentLocation};
		const bestPosition = this._targetLogic(0);
		
	}
	
	updateFrame(frameNo: number): RenderObject {
		const progress = frameNo - this.__startTime;

		// * Update frightened timer
		if (this.state == "frightened") {
			if (frameNo - this._frightStart >= this._frightTimer) {
				this.state = "chase";
			}
		}


		// Get current position on gameboard
		const currentBoardPos = {...this.__currentLocation};
		
		// Check to see if we have moved a tile
		if (!this._moveProcessed && this.__currentLocation.bx !== currentBoardPos.bx || this.__currentLocation.by !== currentBoardPos.by) {
			console.log("We have moved");
			
			// Update the record so we can perform the check next time
			this.knownPreviousLocation = {...this.__currentLocation};
			this.__currentLocation = {...currentBoardPos};
			this.knownCurrentLocation = {...currentBoardPos};
			console.log("Location Previously", this.knownPreviousLocation, "Current Location", this.knownCurrentLocation);

			// Do target stuff
			const bestPos = this._targetLogic(frameNo);
			console.log("Target block", this.knownTargetLocation, "Move to", bestPos);

			this._latentDirection = bestPos?.direction ?? "none";
			this._moveProcessed = false;
		
		}
		
		// Check to see if we are at the turning point
		if (!this._moveProcessed && (currentBoardPos.bx !== this.__turningLocation.bx || currentBoardPos.by !== this.__turningLocation.by)) {
			console.log("Processing direction change")
			
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
					canProcessNow = currCanvasPos.cx % 16 <= 8;
					break;
				case "right":
					canProcessNow = currCanvasPos.cx % 16 > 8;
				case "none":
					canProcessNow = true;
					// Idk when this'll happen so I want to know
					break;
			}

			if (canProcessNow) {
				console.log("processing now")
				
				this._moveProcessed = true;
				// Set startpos to current (rounded obviously)
				this.__startPositionForVector = {
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
				cx: this.__startPositionForVector.cx + this.__currentVector.x * progress,
				cy: this.__startPositionForVector.cy + this.__currentVector.y * progress,
			},
			sheetCoords: this._imageDeterminer(frameNo)
		}
	}

	private _targetLogic(frameNo: number): moveInfo | undefined {
		let currBoardPos = GameBoard.getPositionOnBoardGrid(this.getCurrentPosition(frameNo));
		// Do target Logic
		const currTarget = this.getTarget();
		this.knownTargetLocation = {...currTarget};
		const forwardPosition = this.__getForwardBoardCoordinate(frameNo);
		console.log("Position moving forward", forwardPosition)
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
		console.log("Current direction", this.direction);
		let currentBoardPos  = GameBoard.getPositionOnBoardGrid(this.getCurrentPosition(frameNo));
		switch (this.direction) {
			case "left":
				currentBoardPos.bx -= 1;
				return currentBoardPos;
			case "right":
				currentBoardPos.bx += 1;
				return currentBoardPos;
			case "down":
				currentBoardPos.by += 1;
				return currentBoardPos;
			case "up":
				currentBoardPos.by -= 1;
				return currentBoardPos;
			default:
				// If for whatever reason we ain't moving, set to right
				return {bx: 0, by: 0};
		}
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