import { GameBoard } from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, moveInfo, RenderObject, vector } from "../types.js";
import { penVectorFromDirection, vectorFromDirection } from "../utilities.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Pinky extends Ghost {
	
	PET_NAME = "Pinky";
	
	protected __startPositionForVector: canvasCoordinate = {cy: 272, cx: 216};
	recordedBoardPosition: boardCoordinate = {by: 14, bx: 13};
	direction: Direction = "down"; 
	protected __currentVector = penVectorFromDirection["down"];
	targetCoord: boardCoordinate = { by: 32, bx: 2 };

	protected __latentMoveInformation: moveInfo = {
		baseCoordinate: { by: 14, bx: 23 },
		coord: {  by: 14, bx: 22 },
		direction: "down"
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
		// console.log("%cProcessing Pinky", 'color: #FCB5FF;');
		return super.updateFrame(frameNo);
	}
}

export { Pinky };