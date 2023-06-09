import { GameBoard } from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, moveInfo, RenderObject, vector } from "../types.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Blinky extends Ghost {
	
	PET_NAME = "Blinky";
	
	protected __startPositionForVector: canvasCoordinate = {cy: 16*14, cx: 13*16}
	recordedBoardLocation: boardCoordinate = {by: 14, bx: 13};
	direction: Direction = "left";
	protected __currentVector: vector = Ghost.getVectorFromDirection("left");
	targetCoord: boardCoordinate = {  by: 14, bx: 12 };

	protected __latentMoveInformation: moveInfo = {
		baseCoordinate: { by: 14, bx: 13 },
		coord: {  by: 14, bx: 12 },
		direction: "left"
	};
	
	constructor(pacmanRef: PacMan, gameBoard: GameBoard) {
		super(pacmanRef, gameBoard);
	}
	
	protected __animationInfo: animationInfo = {
		down: "blinkyDown",
		left: "blinkyLeft",
		right: "blinkyRight",
		up: "blinkyUp"
	};
	
	getTarget(frameNo: number) {
		return this.__pacmanReference.recordedBoardPosition;
	}

	updateFrame(frameNo: number): RenderObject {
		console.log("%cProcessing Blinky", 'color: #ff0000;');
		return super.updateFrame(frameNo);
	}

}

export { Blinky };