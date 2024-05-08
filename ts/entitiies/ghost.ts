import Entity from "../entity.js";
import GameBoard from "../gameBoard.js";
import { unpackCoords } from "../index.js";
import spriteManager from "../spriteManager.js";
import { Direction, GhostIDs, GhostNames, GridCell, RenderObject, boardCoordinate, canvasCoordinate, moveInfo, spriteManagerItems, vector } from "../types.js";
import { penVectorFromDirection, vectorFromDirection } from "../utilities.js";
import MonsterState from "../monsterState.js";
import ExitPenController, { LAST_FLAG } from "./exitPenController.js";
import { ghostsExiting } from "../monsterPen.js";
import { MONSTER_PEN } from "../director.js";

abstract class Ghost extends Entity {

	// Items that do not update
	abstract readonly PET_NAME: GhostNames;
	protected readonly __ABSOLUTE_START_POS: canvasCoordinate;
	protected abstract __ghostNumber: GhostIDs;


	// Items that update singly or paired.
	protected __state: MonsterState = MonsterState.IN_PEN;
	private _frightTimer = 0;
	private _frightStart = 0;

	// Needed because the ghosts can both be in the pen and be frightened at the
	// same time. So when they exit the pen they should be frightened but in the
	// pen they still need the frightened animation
	private _isFrightened = false;

	
	// Items that are updated manually
	abstract recordedBoardPosition: boardCoordinate;
	abstract targetCoord: boardCoordinate;
	
	// Items that needed to be updated on velocity + position change
	protected abstract __latentMoveInformation: moveInfo;
	private _moveProcessed = true;

	abstract scatterTarget: boardCoordinate;

	protected __exitPenController: ExitPenController;

	

	constructor() {
		super();

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
		if (this._isFrightened && frameNo - this._frightStart >= this._frightTimer) {
			if (this.__state != MonsterState.IN_PEN) {
				this.setVelocityVector(vectorFromDirection[this.__latentMoveInformation.direction], this.__latentMoveInformation.direction, frameNo);
			}
			this._isFrightened = false;
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

		if (this.__state == MonsterState.IN_PEN) {
			this._handlePenMovement(frameNo, currentBoardPos, currentCanvasPos);
		} else {
			this._handleMazeMovement(frameNo, haveMoved, canApplyLatentMove, currentBoardPos, currentCanvasPos);
		}

		// Yet to handle is SCATTER_MODE and EYES_TO_PEN

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
		this._frightStart = timestamp;
		this._frightTimer = timer;
		this._isFrightened = true;
	}

	private _imageDeterminer(frameNo: number): canvasCoordinate {

		const progression = frameNo - this.__startFrame;
		let indexName: spriteManagerItems
		let animLength: number;
		let frameNumber: number;

		if (this._isFrightened) {
			const frightProgression = frameNo - this._frightStart;
	
			indexName = (this._frightTimer - frightProgression <= 2000) ? "ghostSkeptical" : "ghostFrightened";
			animLength = spriteManager[indexName].length;
			frameNumber = Math.floor(frightProgression / Entity.FRAMES_PER_IMAGE) % animLength
	
			return spriteManager[indexName][frameNumber];
		}
		
		switch (this.__state) {
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

	private _handlePenMovement(frameNo: number, currentBoardPos: boardCoordinate, currentCanvasPos: canvasCoordinate) {

		if (this.__exitPenController.lastFlag < LAST_FLAG.TOWARDS_CENTER && ghostsExiting.indexOf(this.__ghostNumber) != -1){
			this.__exitPenController.startExitingPen(currentBoardPos);
			this.updateCanvasCoords(frameNo);
			this.setVelocityVector(this.__exitPenController.vector, this.__exitPenController.direction, frameNo);

			return;
		}

			
		const shouldUpdateExit = this.__exitPenController.updateDirection(currentBoardPos, currentCanvasPos);

		if (!shouldUpdateExit)
			return;

		if (this.__exitPenController.lastFlag == LAST_FLAG.EXITED_TOP) {

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
			
			MONSTER_PEN.signalExited(this.__ghostNumber);

			return;
		}

		if (this.__exitPenController.lastFlag == LAST_FLAG.HEADING_UP) {
			this.setCanvasCoords(frameNo, { cx: 13 * 16 + 8, cy: currentCanvasPos.cy});
			this.setVelocityVector(this.__exitPenController.vector, this.__exitPenController.direction, frameNo);

			return;
		}

		// Just oscillating center
		this.updateCanvasCoords(frameNo);
		this.setVelocityVector(penVectorFromDirection[this.__exitPenController.direction], this.__exitPenController.direction, frameNo);
	}

	private _handleMazeMovement(frameNo: number, haveMoved: boolean, canApplyLatentMove: boolean, currentBoardPos: boardCoordinate, currentCanvasPos: canvasCoordinate) {
		// Check if we have moved
		if (haveMoved) {

			// Update latent information before assigning previous
			if (this._isFrightened) {
				this.__latentMoveInformation = this._getRandomMove();
			} else {
				this.__latentMoveInformation = this._getTargetMove();
				// Calculate the new target coord
				this.targetCoord = this.getTarget(frameNo);
			}

			// Now we need to wait until we can actually apply the latent information
			this._moveProcessed = false;
			
			// Now update previous
			this.recordedBoardPosition = currentBoardPos;

			return;
		}
		
		if (canApplyLatentMove) {
			
			if (!this.__checkIfAcrossCenter(currentCanvasPos))
				return;
			
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