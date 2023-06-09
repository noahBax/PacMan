import { Controller } from "../controller.js";
import { Entity } from "../entity.js";
import { GameBoard } from "../gameBoard.js";
import { spriteManager, spriteManagerItems } from "../spriteManager.js";
import { Direction, canvasCoordinate, vector, RenderObject, animationInfo, boardCoordinate, moveInfo } from "../types.js";

class PacMan extends Entity{
	
	protected __currentVector: vector = {x: 0, y: 0};
	protected __startPositionForVector: canvasCoordinate = {cx: 216, cy: 320}
	private _animationState: ("normal" | "dying") = "normal";
	private _controller: Controller;

	private _isCornering = false;
	private _corneringTarget: boardCoordinate;

	direction: Exclude<Direction, "none"> = "right";
	private _previousDirection: Exclude<Direction, "none"> = "right";

	
	recordedBoardPosition: boardCoordinate = {bx: 14, by: 20};

	private _haveCheckedForWall = true;

	protected __animationInfo: animationInfo = {
		down: "pacDown",
		up: "pacUp",
		left: "pacLeft",
		right: "pacRight",
		none: "pacStatic"
	};

	setController(controller: Controller) {
		this._controller = controller;
	}
	
	updateFrame(frameNo: number): RenderObject {
		
		let currentCanvasPos = this.getCanvasCoords(frameNo);

		let currentBoardPos = this.getBoardCoordinatesCentered(frameNo);

		
		/**
		 * Some things to consider
		 * If pacman is moving, and nothing is changing then we don't need to change anything
		 * If a button is pressed, we need to check if that direction is open and then adjust velocity for that direction
		 * If we come to a spot where there are multiple paths available, then we try each direction from the end of the list and otherwise default to the current direction
		 * If we bump into a wall though...
		 * I recommend we do this the same way as the ghosts
		 * That being we watch to see when we cross the center and if the current direction is invalid we set the direction to none
		*/
		
		// Get valid positions around current cell
		const legalMoves = GameBoard.getLegalMoves(currentBoardPos, "none");
		const dirs = legalMoves.map(moveInfo => moveInfo.direction);

		// First check to see if we've run into a wall

		if (this._isCornering) this.checkCornering(frameNo, currentCanvasPos, currentBoardPos);
		
		// Check to see if something has changed
		if (this._controller.listUpdatedFlag) this._fillControllerCracks(legalMoves, currentCanvasPos, frameNo);

		if (this.recordedBoardPosition.bx !== currentBoardPos.bx || this.recordedBoardPosition.by !== currentBoardPos.by) {	// Check if we have moved cells
			this._haveCheckedForWall = false;
			this.recordedBoardPosition = currentBoardPos;
			this._fillControllerCracks(legalMoves, currentCanvasPos, frameNo);
		}
		if (!this._haveCheckedForWall && this.__checkIfAcrossCenter(currentCanvasPos)) {								// Check if we can process
			

			// Now check if our current direction will bump us into that wall
			let okayToMove = dirs.includes(this.direction);//legalMoves.some( move => move.direction === this.direction);
			

			if (!okayToMove){
				this.setVelocityVector({ x: 0, y: 0 }, this.direction, frameNo);
				this.setCanvasCoords(frameNo, currentCanvasPos, true, true);
			}

			this._haveCheckedForWall = true;
		}


		return {
			placementCoords: currentCanvasPos,
			sheetCoords: this._imageDeterminer(frameNo)
		};
	}

	/**
	 * Get pacman to go in the first direction he can given the queue of directions and available directions
	 */
	private _fillControllerCracks(legalMoves: moveInfo[], pos: canvasCoordinate, frameNo: number) {
		const presses = this._controller.buttonPressList;
		const dirs = legalMoves.map( move => move.direction );

		// No check needed for if list is empty, this will take care of it
		for (let i = presses.length - 1; i >= 0; i--) {
			if (dirs.includes(presses[i])) {
				this.setVelocityVector(this._computePossibleCornerVector(this.direction, presses[i]), this.direction, frameNo);
				this._corneringTarget = legalMoves[i].coord;
				if (presses[i] === "left" || presses[i] === "right") {
					this.setCanvasCoords(frameNo, pos, false, true);
				} else {
					this.setCanvasCoords(frameNo, pos, true, false);
				}
				break;
			}
		}
		// If it didn't match, we don't care. Just continue going. It's why we check for a wall after this

		this._controller.listUpdatedFlag = false;
	}

	private checkCornering(frameNo: number, canvasCoords: canvasCoordinate, boardCoords: boardCoordinate) {
		// if (boardCoords.bx !== this._corneringTarget.bx || boardCoords.by !== this._corneringTarget.by) return;
		switch (this._previousDirection) {
			case "down":
				if ((canvasCoords.cy+8) % 16 >= 8){
					this.updateCanvasCoords(frameNo, false, true);
					this.setVelocityVector(Entity.getVectorFromDirection(this.direction), this.direction, frameNo);
					this._isCornering = false;
				}
				break;
			case "left":
				if ((canvasCoords.cx+8) % 16 <= 8) {
					this.updateCanvasCoords(frameNo, true, false);
					this.setVelocityVector(Entity.getVectorFromDirection(this.direction), this.direction, frameNo);
					this._isCornering = false;
				}
				break;
			case "right":
				if ((canvasCoords.cx+8) % 16 >= 8) {
					this.updateCanvasCoords(frameNo, true, false);
					this.setVelocityVector(Entity.getVectorFromDirection(this.direction), this.direction, frameNo);
					this._isCornering = false;
				}
				break;
			case "up":
				if ((canvasCoords.cy+8) % 16 <= 8) {
					this.updateCanvasCoords(frameNo, false, true);
					this.setVelocityVector(Entity.getVectorFromDirection(this.direction), this.direction, frameNo);
					this._isCornering = false;
				}
		}
	}

	private _computePossibleCornerVector(oldDir: Exclude<Direction, "none">, newDir: Exclude<Direction, "none">): vector {
		
		// Take care of turning around and standing still
		if (this.__currentVector.x === 0 && this.__currentVector.y === 0 || oldDir === newDir || oldDir === "left" && newDir === "right" || oldDir === "up" && newDir === "down" || newDir === "left" && oldDir === "right" || newDir === "up" && oldDir === "down") {
			return Entity.getVectorFromDirection(newDir);
		}
		let ret: vector = { x: 0, y: 0 };
		let t = Controller.DRIVING_SPEED;

		if (oldDir === "right" || newDir === "right") ret.x = t;
		else ret.x = -t;

		if (oldDir === "down" || newDir === "down") ret.y = t;
		else ret.y = -t;

		this._isCornering = true;
		
		// if (oldDir === "right" || newDir === "right"){
		// 	ret.x = t;
		// 	coord
		// }
		// else {
		// 	ret.x = -t;
		// }
		
		// if (oldDir === "up" || newDir === "up") ret.y = -t;
		// else ret.y = t;

		// this._isCornering = true;
		
		// if (oldDir === "right") {
		// 	if (newDir === "down") 	return { x: t, y: t};
		// 	if (newDir === "up") 	return { x: t, y: -t};
		// 	return Entity.getVectorFromDirection(newDir);
		// }
		// if (oldDir === "left") {
		// 	if (newDir === "down") 	return { x: -t, y: t };
		// 	if (newDir === "up")	return { x: -t, y: -t };
		// 	return Entity.getVectorFromDirection(newDir);
		// }
		// if (oldDir === "down") {
		// 	if (newDir === "right") return { x: t, y: t};
		// 	if (newDir === "left") return { x: -t, y: t};
		// 	return Entity.getVectorFromDirection(newDir);
		// }
		// if (newDir === "right") 

		return ret;
	}

	private _imageDeterminer(frameNo: number): canvasCoordinate {
		if (this._animationState === "normal") {
			const progression = frameNo - this.__startFrame;

			const indexName: spriteManagerItems = this.__animationInfo[this.direction]
			const animLength = spriteManager[indexName].length;
			const frameNumer = Math.floor(progression / Entity._FRAMES_PER_IMAGE) % animLength

			// return spriteManager.pacStatic[0];
			return spriteManager[indexName][frameNumer];
		}
	}

	setVelocityVector(vector: vector, direction: Direction, frameNo: number) {
		this._previousDirection = this.direction;
		super.setVelocityVector(vector, direction, frameNo);
	}
	
}

export { PacMan };