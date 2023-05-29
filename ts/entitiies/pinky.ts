import { GameBoard } from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, RenderObject, vector } from "../types.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Pinky extends Ghost {
	
	protected __currentBoardLocation: boardCoordinate = {by: 4, bx: 1};
	protected __startPositionForVector: canvasCoordinate = {cy: 64, cx: 16};
	direction: Direction = "right";
	protected __currentVector = Ghost.getVectorFromDirection("right");
	
	constructor(pacmanRef: PacMan) {
		super(pacmanRef);
		
	}
	
	__animationInfo: animationInfo = {
		down: "pinkyDown",
		left: "pinkyLeft",
		right: "pinkyRight",
		up: "pinkyUp"
	};

	getTarget(): boardCoordinate {
		return {bx: 0, by: 0};
	}

	updateFrame(frameNo: number): RenderObject {
		console.log("Processing Pinky");
		return super.updateFrame(frameNo);
	}
}

export { Pinky };