import { GameBoard } from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, moveInfo, RenderObject, vector } from "../types.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Inky extends Ghost {
	
	PET_NAME = "Inky";
	
	protected __startPositionForVector: canvasCoordinate = {cy: 512, cx: 416};
	recordedBoardLocation: boardCoordinate = {by: 32, bx: 26};
	direction: Direction = "left";
	protected __currentVector = Ghost.getVectorFromDirection("left");
	targetCoord: boardCoordinate = { by: 32, bx: 25};

	protected __latentMoveInformation: moveInfo = {
		baseCoordinate: { by: 32, bx: 26 },
		coord: {  by: 32, bx: 25 },
		direction: "left"
	};
	
	constructor(pacmanRef: PacMan, gameBoard: GameBoard) {
		super(pacmanRef, gameBoard);
	}
	
	protected __animationInfo: animationInfo = {
		down: "inkyDown",
		left: "inkyLeft",
		right: "inkyRight",
		up: "inkyUp"
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
	}

	updateFrame(frameNo: number): RenderObject {
		console.log("%cProcessing Inky", 'color: #00ffff;');
		return super.updateFrame(frameNo);
	}
	
}

export { Inky };