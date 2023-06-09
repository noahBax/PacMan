import { GameBoard } from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, moveInfo, RenderObject, vector } from "../types.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Pinky extends Ghost {
	
	PET_NAME = "Pinky";
	
	protected __startPositionForVector: canvasCoordinate = {cy: 64, cx: 16};
	recordedBoardLocation: boardCoordinate = { by: 4, bx: 1 };
	direction: Direction = "right";
	protected __currentVector = Ghost.getVectorFromDirection("right");
	targetCoord: boardCoordinate = { by: 4, bx: 2};

	protected __latentMoveInformation: moveInfo = {
		baseCoordinate: { by: 4, bx: 1 },
		coord: {  by: 4, bx: 2 },
		direction: "right"
	};
	
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
		// return this.__pacmanReference.getBoardCoordinates(frameNo);
		return this.__pacmanReference.recordedBoardPosition;
	}

	updateFrame(frameNo: number): RenderObject {
		console.log("%cProcessing Pinky", 'color: #FCB5FF;');
		return super.updateFrame(frameNo);
	}
}

export { Pinky };