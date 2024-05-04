import { PACMAN } from "../director.js";
import { GameBoard } from "../gameBoard.js";
import MonsterState from "../monsterState.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, GhostIDs, GhostNames, moveInfo, RenderObject, vector } from "../types.js";
import { vectorFromDirection } from "../utilities.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Blinky extends Ghost {

	protected __ghostNumber: GhostIDs.BLINKY;
	
	PET_NAME = GhostNames.BLINKY;
	
	protected __startPositionForVector: canvasCoordinate = {cy: 16*14, cx: 13*16}
	recordedBoardPosition: boardCoordinate = {by: 14, bx: 13};
	direction: Direction = "left";
	protected __currentVector: vector = vectorFromDirection["left"];
	targetCoord: boardCoordinate = {  by: 14, bx: 12 };

	protected __latentMoveInformation: moveInfo = {
		baseCoordinate: { by: 14, bx: 13 },
		coord: {  by: 14, bx: 12 },
		direction: "left"
	};

	scatterTarget = {
		by: 0,
		bx: 25
	}
	
	constructor() {
		super();
		this.__state = MonsterState.CHASE_MODE;
	}
	
	protected __animationInfo: animationInfo = {
		down: "blinkyDown",
		left: "blinkyLeft",
		right: "blinkyRight",
		up: "blinkyUp"
	};
	
	getTarget(frameNo: number) {
		let pos = {...PACMAN.recordedBoardPosition};
		if (pos.bx < 0) pos.bx = 0;
		else if (pos.bx >= GameBoard.width) pos.bx = GameBoard.width - 1;

		if (pos.by < 0) pos.by = 0;
		else if (pos.by >= GameBoard.height) pos.by = GameBoard.height - 1;
		return pos;
	}

	updateFrame(frameNo: number): RenderObject {
		// console.log("%cProcessing Blinky", 'color: #ff0000;');
		return super.updateFrame(frameNo);
	}

}

export { Blinky };