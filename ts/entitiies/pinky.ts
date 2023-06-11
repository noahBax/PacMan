import { GameBoard } from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, moveInfo, RenderObject, vector } from "../types.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Pinky extends Ghost {
	
	PET_NAME = "Pinky";
	
	protected __startPositionForVector: canvasCoordinate = {cy: 64, cx: 16};
	recordedBoardPosition: boardCoordinate = { by: 4, bx: 1 };
	direction: Direction = "right";
	protected __currentVector = Ghost.vectorFromDirection["right"];
	targetCoord: boardCoordinate = { by: 4, bx: 2};

	protected __latentMoveInformation: moveInfo = {
		baseCoordinate: { by: 4, bx: 1 },
		coord: {  by: 4, bx: 2 },
		direction: "right"
	};
	
	scatterTarget = {
		by: 0,
		bx: 2
	}
	
	constructor(pacmanRef: PacMan, gameBoard: GameBoard) {
		super(pacmanRef, gameBoard);
	}
	
	__animationInfo: animationInfo = {
		down: "pinkyDown",
		left: "pinkyLeft",
		right: "pinkyRight",
		up: "pinkyUp"
	};

	getTarget(frameNo: number): boardCoordinate {
		let coordRn = {...this.__pacmanReference.recordedBoardPosition};
		switch (this.__pacmanReference.direction) {
			case "down":
				if (coordRn.by < GameBoard.height - 5) {
					coordRn.by += 4;
				} else {
					coordRn.by = GameBoard.height - 1;
				}
				return coordRn;
			case "up":
				if (coordRn.by > 4) {
					coordRn.by -= 4;
				} else {
					coordRn.by = 0;
				}
				if (coordRn.bx > 4) {
					coordRn.bx -= 4;
				} else {
					coordRn.bx = 0;
				}
				return coordRn;
			case "left":
				if (coordRn.bx > 4) {
					coordRn.bx -= 4;
				} else {
					coordRn.bx = 0;
				}
				return coordRn;
			case "right":
				if (coordRn.bx < GameBoard.width - 5) {
					coordRn.bx += 4;
				} else {
					coordRn.bx = GameBoard.width - 1
				}
				return coordRn;
		}
		// return this.__pacmanReference.getBoardCoordinates(frameNo);
	}

	updateFrame(frameNo: number): RenderObject {
		console.log("%cProcessing Pinky", 'color: #FCB5FF;');
		return super.updateFrame(frameNo);
	}
}

export { Pinky };