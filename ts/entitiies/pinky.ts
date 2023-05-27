import { GameBoard } from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, RenderObject, vector } from "../types.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Pinky extends Ghost {

	__startPosition: canvasCoordinate = {cx: 16, cy:64};
	direction: Direction = "right";
	__currentVector = Ghost.getVectorFromDirection("right");
	
	constructor(pacmanRef: PacMan) {
		super(pacmanRef);
		this.__lastRecordedLocation = {bx: 0, by: 0};
		
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