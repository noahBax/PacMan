import { GameBoard } from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, RenderObject, vector } from "../types.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Blinky extends Ghost {
	
	protected __startPositionForVector: canvasCoordinate = {cy: 16*14, cx: 13*16}
	protected __currentBoardLocation: boardCoordinate = {by: 14, bx: 13};
	direction: Direction = "left";
	protected __currentVector: vector = Ghost.getVectorFromDirection("left");
	
	constructor(pacmanRef: PacMan) {
		super(pacmanRef);
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