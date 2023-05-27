import { GameBoard } from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, RenderObject, vector } from "../types.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Clyde extends Ghost {

	protected __startPosition: canvasCoordinate = {cx: 16, cy: 528}
	direction: Direction = "right"; 
	protected __currentVector = Ghost.getVectorFromDirection("right");
	
	constructor(pacmanRef: PacMan) {
		super(pacmanRef);
		this.__lastRecordedLocation = {bx: 0, by: 0}
		
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