import Entity from "../entity.js";
import GameBoard from "../gameBoard.js";
import { unpackCoords } from "../index.js";
import spriteManager from "../spriteManager.js";
import { Direction, GhostIDs, GhostNames, GridCell, RenderObject, boardCoordinate, canvasCoordinate, moveInfo, spriteManagerItems, vector } from "../types.js";
import { penVectorFromDirection, vectorFromDirection } from "../utilities.js";
import MonsterState from "../monsterState.js";
import IdleController from "./idleController.js";
import ExitPenController from "./exitPenController.js";
import { ghostsExiting } from "../monsterPen.js";

abstract class Ghost extends Entity {

	// Items that do not update
	abstract readonly PET_NAME: GhostNames;
	protected readonly __ABSOLUTE_START_POS: canvasCoordinate;


	// Items that update singly or paired.
	protected __state: MonsterState = MonsterState.IDLE_IN_PEN;
	private _savedFrightState = MonsterState.IDLE_IN_PEN;
	private _frightTimer = 0;
	private _frightStart = 0;

	
	// Items that are updated manually
	abstract recordedBoardPosition: boardCoordinate;
	abstract targetCoord: boardCoordinate;
	
	// Items that needed to be updated on velocity + position change
	protected abstract __latentMoveInformation: moveInfo;
	private _moveProcessed = true;

	abstract scatterTarget: boardCoordinate;

	protected __idleController: IdleController;
	protected __exitPenController: ExitPenController;

	protected abstract __ghostNumber: GhostIDs;
	

	constructor() {
		super();

		this.__idleController = new IdleController();
		this.__exitPenController = new ExitPenController();
	}

	setCanvasCoords(frameNo: number, newCoords: canvasCoordinate, roundToBoard=false, updateLatentInformation=false, shouldUpdateTarget=false) {

		this._moveProcessed = true;

		// Do this before assigning previous
		if (updateLatentInformation) this.__latentMoveInformation = this._getTargetMove();
		
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
		if (this.__state == MonsterState.FRIGHTENED) {
			if (frameNo - this._frightStart >= this._frightTimer) {
				this.__state = this._savedFrightState;
				this.setVelocityVector(vectorFromDirection[this.__latentMoveInformation.direction], this.__latentMoveInformation.direction, frameNo);
			}
		}

		/**
		 * Do a purgatory check here to teleport us to the correct side
		 */
		this.purgatoryCheck(frameNo);		
		
		// Get current position on game board
		let currentCanvasPos = this.getCanvasCoords(frameNo);
		// Get the cell our center is in
		let currentBoardPos = this.getBoardCoordinatesCentered(frameNo);
		
		const haveMoved = currentBoardPos.bx === this.__latentMoveInformation.coord.bx && currentBoardPos.by === this.__latentMoveInformation.coord.by;
		const canApplyLatentMove = (
			!haveMoved &&
			!this._moveProcessed &&
			currentBoardPos.bx === this.__latentMoveInformation.baseCoordinate.bx &&
			currentBoardPos.by === this.__latentMoveInformation.baseCoordinate.by
		);

		switch(this.__state) {
			case MonsterState.IDLE_IN_PEN: // In the pen and wandering. We can literally only go up or down

				if (ghostsExiting.indexOf(this.__ghostNumber) != -1){
					this.__state = MonsterState.EXITING_PEN;
					this.__exitPenController.startExitingPen(currentBoardPos);
					this.updateCanvasCoords(frameNo);
					this.setVelocityVector(this.__exitPenController.vector, this.__exitPenController.direction, frameNo);
					break;
				}

				const shouldUpdateIdle = this.__idleController.updateDirection(currentBoardPos.by);
				if (shouldUpdateIdle) {
					this.updateCanvasCoords(frameNo);
					this.setVelocityVector(penVectorFromDirection[this.__idleController.direction], this.__idleController.direction, frameNo);	
				}

				break;

			case MonsterState.EXITING_PEN: // Move to the center of the pen then move up

				const shouldUpdateExit = this.__exitPenController.updateDirection(currentBoardPos, currentCanvasPos);

				if (shouldUpdateExit) {
					
					if (this.__exitPenController.stage == 0) {
						this.setCanvasCoords(frameNo, { cx: 13 * 16 + 8, cy: 14 * 16});
						this.__state = MonsterState.CHASE_MODE;

						// Calculate the new target coord
						this.targetCoord = this.getTarget(frameNo);
			
						// Update latent information before assigning previous
						if (this.targetCoord.bx > currentBoardPos.bx) {
							this.__latentMoveInformation = {
								baseCoordinate: { bx: 13, by: 14 },
								coord: { bx: 14, by: 14 },
								direction: "right"
							};
							this.setVelocityVector(vectorFromDirection['right'], 'right', frameNo);
						} else {
							this.__latentMoveInformation = {
								baseCoordinate: { bx: 13, by: 14 },
								coord: { bx: 12, by: 14 },
								direction: "left"
							};
							this.setVelocityVector(vectorFromDirection['left'], 'left', frameNo);
						}
			
						this._moveProcessed = true;
						
						this.recordedBoardPosition = currentBoardPos;

					} else {
						this.setCanvasCoords(frameNo, { cx: 13 * 16 + 8, cy: currentCanvasPos.cy});
						this.setVelocityVector(this.__exitPenController.vector, this.__exitPenController.direction, frameNo)
					}
				}

				break;

			case MonsterState.CHASE_MODE:

				// Check if we have moved
				if (haveMoved) {

					// Calculate the new target coord
					this.targetCoord = this.getTarget(frameNo);
		
					// Update latent information before assigning previous
					this.__latentMoveInformation = this._getTargetMove();
		
					// Now we need to wait until we can actually apply the latent information
					this._moveProcessed = false;
					
					// Now update previous
					this.recordedBoardPosition = currentBoardPos;

				} else if (canApplyLatentMove) {
					
					if (!this.__checkIfAcrossCenter(currentCanvasPos))
						break;
					
					// We are across the center
					
					this.setVelocityVector(vectorFromDirection[this.__latentMoveInformation.direction], this.__latentMoveInformation.direction, frameNo);
					this.setCanvasCoords(frameNo, currentCanvasPos, true, false);
					
					this._moveProcessed = true;
	
					// Update canvas coords
					currentCanvasPos = this.getCanvasCoords(frameNo);
	
					// ToDo: Ideally I want to have the Ghost's eyes facing in
					// the direction they want to turn before it is decided. So
					// I may have things start looking at the latent direction
				}
				
				break;
							
			case MonsterState.FRIGHTENED:
				
				if (haveMoved) {
					// Update latent information before assigning previous
					this.__latentMoveInformation = this._getRandomMove();
					
					// Now we need to wait until we can actually apply the latent information
					this._moveProcessed = false;
					
					// Now update previous
					this.recordedBoardPosition = currentBoardPos;
					
				} else if (canApplyLatentMove) {

					if (!this.__checkIfAcrossCenter(currentCanvasPos))
						break;

					this.setVelocityVector(vectorFromDirection[this.__latentMoveInformation.direction], this.__latentMoveInformation.direction, frameNo);
					this.setCanvasCoords(frameNo, currentCanvasPos, true, false);
					
					this._moveProcessed = true;
	
					// Update canvas coords
					currentCanvasPos = this.getCanvasCoords(frameNo);
		
					// ToDo: Ideally I want to have the Ghost's eyes facing in
					// the direction they want to turn before it is decided. So
					// I may have things start looking at the latent direction
				}
				break;

			case MonsterState.SCATTER_MODE:
				// ToDo: Not implemented yet
				break;
			case MonsterState.EYES_TO_PEN:
				// ToDo: Not implemented yet
				break;
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

	private _getRandomMove(): moveInfo {
		
		const legalMoves = GameBoard.getLegalMoves(this.__latentMoveInformation.coord, this.direction, true);

		let alternatives: Direction[] = ["right", "down", "left", "up"];
		let preferredDir: Direction = alternatives[Math.floor(Math.random() * 4)];

		legalMoves.sort( (a, b) => {
			return alternatives.indexOf(a.direction) - alternatives.indexOf(b.direction);
		});

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
	}

	private _getTargetMove(): moveInfo {

		const legalMoves = GameBoard.getLegalMoves(this.__latentMoveInformation.coord, this.direction, true);

		let bestDistance = Infinity;
		let bestMove: moveInfo;
		legalMoves.forEach(move => {

			// Check to see if this is the square being occupied
			if (!(move.coord.bx === this.recordedBoardPosition.bx && move.coord.by === this.recordedBoardPosition.by)) {

				const distance = (this.targetCoord.bx - move.coord.bx)**2 + (this.targetCoord.by - move.coord.by)**2;
				if (distance < bestDistance) {
					bestDistance = distance;
					bestMove = move;
				}
			}
		});

		return bestMove;
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
		this._savedFrightState = this.__state;
		this.__state = MonsterState.FRIGHTENED;
		this._frightStart = timestamp;
		this._frightTimer = timer;
	}

	private _imageDeterminer(frameNo: number): canvasCoordinate {

		const progression = frameNo - this.__startFrame;
		let indexName: spriteManagerItems
		let animLength: number;
		let frameNumber: number;
		
		switch (this.__state) {
			case MonsterState.FRIGHTENED:
				const frightProgression = frameNo - this._frightStart;

				indexName = (this._frightTimer - frightProgression <= 2000) ? "ghostSkeptical" : "ghostFrightened";
				animLength = spriteManager[indexName].length;
				frameNumber = Math.floor(frightProgression / Entity.FRAMES_PER_IMAGE) % animLength

				return spriteManager[indexName][frameNumber];
				
			case MonsterState.EYES_TO_PEN:

				indexName = "eyes";
				animLength = spriteManager[indexName].length;
				frameNumber = Math.floor(progression / Entity.FRAMES_PER_IMAGE) % animLength

				break;

			default:

				indexName = this.__animationInfo[this.__latentMoveInformation.direction];
				animLength = spriteManager[indexName].length;
				frameNumber = Math.floor(progression / Entity.FRAMES_PER_IMAGE) % animLength;

				return spriteManager[indexName][frameNumber];
		}
	}

	private logDebugInformation(currentBoardPos: boardCoordinate, currentCanvasPos: canvasCoordinate) {
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
	}

}


export default Ghost;