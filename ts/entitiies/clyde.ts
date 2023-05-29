import { GameBoard } from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, RenderObject, vector } from "../types.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Clyde extends Ghost {
	
	PET_NAME = "Clyde";
	
	protected __currentBoardLocation: boardCoordinate = {by: 32, bx: 1};
	protected __startPositionForVector: canvasCoordinate = {cy: 32*16, cx: 16, }
	direction: Direction = "right"; 
	protected __currentVector = Ghost.getVectorFromDirection("right");
	
	constructor(pacmanRef: PacMan, gameBoard: GameBoard) {
		super(pacmanRef, gameBoard);
	}
	
	protected __animationInfo: animationInfo = {
		down: "clydeDown",
		left: "clydeLeft",
		right: "clydeRight",
		up: "clydeUp"
	};

	getTarget(): boardCoordinate {
		return {bx: 0, by: 0}
	}

	updateFrame(frameNo: number): RenderObject {
		console.log("Processing Clyde");
		return super.updateFrame(frameNo);
	}
}

export { Clyde };