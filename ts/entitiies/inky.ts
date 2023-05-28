import { GameBoard } from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, RenderObject, vector } from "../types.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Inky extends Ghost {
	
	protected __currentLocation: boardCoordinate = {by: 32, bx: 25};
	protected __startPositionForVector: canvasCoordinate = {cy: 512, cx: 416};
	direction: Direction = "left";
	protected __currentVector = Ghost.getVectorFromDirection("left");
	
	constructor(pacmanRef: PacMan) {
		super(pacmanRef);
		
	}
	
	protected __animationInfo: animationInfo = {
		down: "inkyDown",
		left: "inkyLeft",
		right: "inkyRight",
		up: "inkyUp"
	};
	
	getTarget(): boardCoordinate {
		let coordRn = {...this.__pacmanReference.currentBoardPosition};
		switch (this.__pacmanReference.direction) {
			case "down":
				coordRn.by += 4;
				return coordRn;
			case "up":
				coordRn.by -= 4;
				return coordRn;
			case "left":
				coordRn.bx -= 4;
				return coordRn;
			case "right":
				coordRn.bx += 4;
				return coordRn;
		}
	}

	updateFrame(frameNo: number): RenderObject {
		console.log("Processing Inky");
		return super.updateFrame(frameNo);
	}
	
}

export { Inky };