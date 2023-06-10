import { GameBoard } from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, moveInfo, RenderObject, vector } from "../types.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Clyde extends Ghost {
	
	PET_NAME = "Clyde";
	
	protected __startPositionForVector: canvasCoordinate = {cy: 32*16, cx: 16, }
	recordedBoardLocation: boardCoordinate = { by: 32, bx: 1 };
	direction: Direction = "right"; 
	protected __currentVector = Ghost.vectorFromDirection["right"];
	targetCoord: boardCoordinate = { by: 32, bx: 2 };

	protected __latentMoveInformation: moveInfo = {
		baseCoordinate: { by: 32, bx: 1 },
		coord: {  by: 32, bx: 2 },
		direction: "left"
	};
	
	constructor(pacmanRef: PacMan, gameBoard: GameBoard) {
		super(pacmanRef, gameBoard);
	}
	
	protected __animationInfo: animationInfo = {
		down: "clydeDown",
		left: "clydeLeft",
		right: "clydeRight",
		up: "clydeUp"
	};

	getTarget(frameNo: number): boardCoordinate {
		// return this.__pacmanReference.getBoardCoordinates(frameNo);
		return this.__pacmanReference.recordedBoardPosition;
	}

	updateFrame(frameNo: number): RenderObject {
		console.log("%cProcessing Clyde", "color: #F8BB55;");
		return super.updateFrame(frameNo);
	}
}

export { Clyde };