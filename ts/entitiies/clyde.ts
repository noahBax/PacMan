import { PACMAN } from "../director.js";
import GameBoard from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, GhostIDs, GhostNames, moveInfo, RenderObject, vector } from "../types.js";
import { penVectorFromDirection, vectorFromDirection } from "../utilities.js";
import Ghost from "./ghost.js";

class Clyde extends Ghost {

	protected __ghostNumber: GhostIDs.CLYDE;
	
	PET_NAME = GhostNames.CLYDE;
	
	protected __startPositionForVector: canvasCoordinate = {cy: 272, cx: 248};
	recordedBoardPosition: boardCoordinate = {by: 14, bx: 13};
	direction: Direction = "down"; 
	protected __currentVector = penVectorFromDirection["down"];
	targetCoord: boardCoordinate = { by: 32, bx: 2 };

	protected __latentMoveInformation: moveInfo = {
		baseCoordinate: { by: 14, bx: 23 },
		coord: {  by: 14, bx: 22 },
		direction: "left"
	};

	scatterTarget = {
		by: 35,
		bx: 0
	}
	
	constructor() {
		super();
	}
	
	protected __animationInfo: animationInfo = {
		down: "clydeDown",
		left: "clydeLeft",
		right: "clydeRight",
		up: "clydeUp"
	};

	getTarget(frameNo: number): boardCoordinate {
		const pacmanPos = PACMAN.recordedBoardPosition
		const distanceToPacman = (this.recordedBoardPosition.bx - pacmanPos.bx)**2 + (this.recordedBoardPosition.by - pacmanPos.by)**2;
		
		if (distanceToPacman < 64) return this.scatterTarget;

		
		let pos = {...PACMAN.recordedBoardPosition};
		if (pos.bx < 0) pos.bx = 0;
		else if (pos.bx >= GameBoard.width) pos.bx = GameBoard.width - 1;

		if (pos.by < 0) pos.by = 0;
		else if (pos.by >= GameBoard.height) pos.by = GameBoard.height - 1;
		return pos;

	}

	updateFrame(frameNo: number): RenderObject {
		// console.log("%cProcessing Clyde", "color: #F8BB55;");
		return super.updateFrame(frameNo);
	}
}

export default Clyde;