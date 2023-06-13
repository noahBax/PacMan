import { Entity } from "../entity.js";
import { GameBoard } from "../gameBoard.js";
import { unpackCoords } from "../index.js";
import { spriteManager } from "../spriteManager.js";
import { Direction, GridCell, RenderObject, boardCoordinate, canvasCoordinate, moveInfo as moveInfo, vector } from "../types.js";
import { PacMan } from "./pacman.js";

abstract class Ghost extends Entity {

	// Items that do not update
	abstract readonly PET_NAME: string;
	private GAME_BOARD: GameBoard;
	protected readonly __ABSOLUTE_START_POS: canvasCoordinate;
	protected __pacmanReference: PacMan;

	// Items that update singly or paired.
	protected __state: ("chase" | "scatter" | "frightened" | "eyes") = "chase"
	private _frightTimer = 0;
	private _frightStart = 0;
	
	
	// Items that are updated manually
	abstract recordedBoardPosition: boardCoordinate;
	abstract targetCoord: boardCoordinate;
	
	// Items that needed to be updated on velocity + position change
	protected abstract __latentMoveInformation: moveInfo;
	private _moveProcessed = true;

	abstract scatterTarget: boardCoordinate;
	
	

	constructor(pacmanRef: PacMan, gameBoard: GameBoard) {
		super()
		this.__pacmanReference = pacmanRef;
		this.GAME_BOARD = gameBoard;
	}

	setCanvasCoords(frameNo: number, newCoords: canvasCoordinate, roundToBoard=false, updateLatentInformation=false, shouldUpdateTarget=false) {

		this._moveProcessed = true;

		// Do this before assigning previous
		if (updateLatentInformation) this.__latentMoveInformation = this._askTargetLogic();//, this.getBoardCoordinatesCentered(frameNo));
		
		// this.previousBoardLocation = this.getBoardCoordinatesCentered(frameNo);		
		
		if (shouldUpdateTarget) this.targetCoord = this.getTarget(frameNo);

		if (roundToBoard) {
			super.setCanvasCoords(frameNo, newCoords, true, true);
		} else {
			super.setCanvasCoords(frameNo, newCoords);
		}

	}
	
	updateFrame(frameNo: number): RenderObject {

		// ToDo: Do turn-around on mode switch

		// Update frightened timer
		if (this.__state == "frightened") {
			if (frameNo - this._frightStart >= this._frightTimer) {
				this.__state = "chase";

			}
		}

		
		
		// Get current position on gameboard
		let currentCanvasPos = this.getCanvasCoords(frameNo);
		// Get the cell our center is in
		let currentBoardPos = this.getBoardCoordinatesCentered(frameNo);
		
		if (this._moveProcessed) {
			console.log("	Move has been PROCESSED");
		} else {
			console.log("	Move has NOT been PROCESSED");
		}
		console.log(`	%cDirection is %c${this.direction}%c. Latent direction is %c${this.__latentMoveInformation.direction}`, 'color: #bada55;', 'color: #FFD700;', 'color: #bada55;', 'color: #FFD700;');
		console.log(`	%cBoard position is %c${unpackCoords(currentBoardPos)}%c, and actual is %c${unpackCoords(currentCanvasPos)}`, 'color: #bada55;', 'color: #FFD700;', 'color: #bada55;', 'color: #FFD700;');
		console.log(`	%cTurning cell is %c${unpackCoords(this.__latentMoveInformation.baseCoordinate)}`, 'color: #bada55', 'color: #FFD700;');
		console.log(`	%cLatent cell is %c${unpackCoords(this.__latentMoveInformation.coord)}`, 'color: #bada55;', 'color: #FFD700;');
		console.log(`	%cPrevious location is,%c${unpackCoords(this.recordedBoardPosition)}`, 'color: #bada55;', 'color: #FFD700');

		if (this.__latentMoveInformation.direction === "none") throw("ahhhh");
		/**
		 * Do a purgatory check here to teleport us to the correct side
		 */
		if (GameBoard.correctForPurgatory(this, currentCanvasPos, frameNo)) {
			currentCanvasPos = this.getCanvasCoords(frameNo);
			
			currentBoardPos = this.getBoardCoordinatesCentered(frameNo);

			// this._moveProcessed = false;
			console.log("	%cMarking move as not processed", 'color: #1111FF;');

			console.log("	%cPergatory adjusted coordinates are", unpackCoords(currentCanvasPos), 'color: #1111FF');
			console.groupEnd();
		}

		// Check if we have moved
		// if (this.recordedBoardLocation.bx !== currentBoardPos.bx || this.recordedBoardLocation.by !== currentBoardPos.by) {
		if (currentBoardPos.bx === this.__latentMoveInformation.coord.bx && currentBoardPos.by === this.__latentMoveInformation.coord.by) {
			console.group(`	%cWe have moved from ${unpackCoords(this.recordedBoardPosition)} to ${unpackCoords(currentBoardPos)}`, 'color: #FFA500');

			// Calculate the new target coord
			this.targetCoord = this.getTarget(frameNo);
			console.log(`	%cUpdated target location is ${unpackCoords(this.targetCoord)}`, 'color: #FFA500');

			// Update latent information before assigning previous
			// Or we can just save it beforehand
			this.__latentMoveInformation = this._askTargetLogic();

			// Now we need to wait until we can actually apply the latent information
			this._moveProcessed = false;
			
			// Now update previous
			this.recordedBoardPosition = currentBoardPos;

			console.log(`	New latent move information is`, this.__latentMoveInformation);

			console.groupEnd();
		} else if (!this._moveProcessed && currentBoardPos.bx === this.__latentMoveInformation.baseCoordinate.bx && currentBoardPos.by === this.__latentMoveInformation.baseCoordinate.by) {

			if (this.__checkIfAcrossCenter(currentCanvasPos)) {
				console.group("	%cWe can apply the latent move", 'color: #00ff00');
				
				console.log(`	%cUnchanged direction is %c${this.direction}`, 'color: #00ff00;', 'color: #FFD700;')
				this.setVelocityVector(Ghost.vectorFromDirection[this.__latentMoveInformation.direction], this.__latentMoveInformation.direction, frameNo);
				console.log(`	%cAdjusted direction is %c${this.direction}`, 'color: #00ff00;', 'color: #ffd700;');
				this.setCanvasCoords(frameNo, currentCanvasPos, true, false);
				
				this._moveProcessed = true;

				// Update canvas coords
				currentCanvasPos = this.getCanvasCoords(frameNo);


				// ToDo: Ideally I want to have the Ghost's eyes facing in the direction they want to turn before it is decided. So I may have things start looking at the latent direction
				console.groupEnd();
			}
		}
		
		
		/**
		 * Return coordinates with respect to canvas
		 * This'll always happen
		 */
		return {
			placementCoords: currentCanvasPos,
			sheetCoords: this._imageDeterminer(frameNo),
			enlarge: true
		}
	}

	private _askTargetLogic(): moveInfo | undefined {

		const legalMoves = GameBoard.getLegalMoves(this.__latentMoveInformation.coord, this.direction, true);
		console.log("	Legal moves around it are", legalMoves);

		if (this.__state === "frightened") {

			// Generate a random number to decide which direction we try first 
			let alternatives: Direction[] = ["right", "down", "left", "up"];
			let preferredDir: Direction = alternatives[Math.floor(Math.random() * 4)];
			legalMoves.sort( (a, b) => {
				return alternatives.indexOf(a.direction) - alternatives.indexOf(b.direction);
			});

			console.log("	Preferred random direction is", preferredDir);

			// If that first direction doesn't work out, order of preference is up, left, down, right
			// We work backwards up that list so that if we find the preferred direction we can take that way first 
			let ret: moveInfo;
			// console.log(legalMoves);
			for (let i = 0; i < legalMoves.length; i++) {
				if ((legalMoves[i].coord.bx === this.recordedBoardPosition.bx && legalMoves[i].coord.by === this.recordedBoardPosition.by)) continue;
				ret = legalMoves[i];
				if (ret.direction === preferredDir) return ret;
			}

			return ret;
			
		} else {
			// Literally an implementation of greedy best first search
			let bestDistance = Infinity;
			let bestMove: moveInfo;
			legalMoves.forEach(move => {
				console.log("	looking at possible move", move);
	
				// Check to see if this is the square being ocupied
				if (!(move.coord.bx === this.recordedBoardPosition.bx && move.coord.by === this.recordedBoardPosition.by)) {
	
					console.log("	Not our previous yay");
					const distance = (this.targetCoord.bx - move.coord.bx)**2 + (this.targetCoord.by - move.coord.by)**2;
					if (distance < bestDistance) {
						bestDistance = distance;
						bestMove = move;
					}
				}
			});
	
			console.log("	Best move toward target is", bestMove);
			return bestMove;
		}

	}

	/**
	 * Get the target tile, where the ghost is trying to get to.
	 */
	abstract getTarget(frameNo: number): boardCoordinate;

	/**
	 * Put the ghost into frightened mode for `timer` ms
	 * @param timer Time in ms
	 * @param timestamp Start time
	 */
	scareMe(timer: number, timestamp: number) {
		this.__state = "frightened";
		this._frightStart = timestamp;
		this._frightTimer = timer;
	}

	private _imageDeterminer(frameNo: number): canvasCoordinate {
		if (this.__state === "frightened") {
			const frightProgression = frameNo - this._frightStart;

			const indexName = (this._frightTimer - frightProgression <= 2000) ? "ghostSkeptical" : "ghostFrightened";
			const animLength = spriteManager[indexName].length;
			const frameNumer = Math.floor(frightProgression / Entity.FRAMES_PER_IMAGE) % animLength

			
			return spriteManager[indexName][frameNumer];
		} else if (this.__state === "eyes") {
			const progression = frameNo - this.__startFrame;

			const indexName = "eyes";
			const animLength = spriteManager[indexName].length;
			const frameNumer = Math.floor(progression / Entity.FRAMES_PER_IMAGE) % animLength
		} else {
			const progression = frameNo - this.__startFrame;

			const indexName = this.__animationInfo[this.__latentMoveInformation.direction];
			const animLength = spriteManager[indexName].length;
			const frameNumer = Math.floor(progression / Entity.FRAMES_PER_IMAGE) % animLength

			return spriteManager[indexName][frameNumer];
		}
	}

}


export { Ghost }