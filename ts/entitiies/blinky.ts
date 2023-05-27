import { GameBoard } from "../gameBoard.js";
import { animationInfo, canvasCoordinate, Direction, RenderObject, vector } from "../types.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Blinky extends Ghost {
	
	protected __startPosition: canvasCoordinate = {cx: 216, cy: 225}
	direction: Direction = "left";
	protected __currentVector: vector = Ghost.getVectorFromDirection("left");
	
	constructor(pacmanRef: PacMan) {
		super(pacmanRef);
		this.__lastRecordedLocation = {bx: 0, by: 0};
	}
	
	protected __animationInfo: animationInfo = {
		down: "blinkyDown",
		left: "blinkyLeft",
		right: "blinkyRight",
		up: "blinkyUp"
	};
	
	getTarget() {
		return this.__pacmanReference.currentBoardPosition;
	}

	updateFrame(frameNo: number): RenderObject {
		console.log("Processing Blinky");
		return super.updateFrame(frameNo);
	}

}

export { Blinky };