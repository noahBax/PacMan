import { PACMAN } from "../director.js";
import { GameBoard } from "../gameBoard.js";
import { animationInfo, boardCoordinate, canvasCoordinate, Direction, GhostIDs, GhostNames, moveInfo, RenderObject, vector } from "../types.js";
import { penVectorFromDirection, vectorFromDirection } from "../utilities.js";
import { Blinky } from "./blinky.js";
import { Ghost } from "./ghost.js";
import { PacMan } from "./pacman.js";

class Inky extends Ghost {
	
	protected __ghostNumber: GhostIDs.INKY;
	PET_NAME = GhostNames.INKY;
	
	protected __startPositionForVector: canvasCoordinate = {cy: 272, cx: 184};
	recordedBoardPosition: boardCoordinate = {by: 14, bx: 13};
	direction: Direction = "down";
	protected __currentVector = penVectorFromDirection["down"];
	targetCoord: boardCoordinate = { by: 14, bx: 23};

	private _blinkyRef: Blinky;

	protected __latentMoveInformation: moveInfo = {
		baseCoordinate: { by: 14, bx: 22 },
		coord: {  by: 14, bx: 23 },
		direction: "down"
	};

	scatterTarget = {
		by: 35,
		bx: 27
	}
	
	constructor(blinkyRef: Blinky) {
		super();
		this._blinkyRef = blinkyRef;
	}
	
	protected __animationInfo: animationInfo = {
		down: "inkyDown",
		left: "inkyLeft",
		right: "inkyRight",
		up: "inkyUp"
	};
	
	getTarget(frameNo: number): boardCoordinate {
		let offsetTile = {...PACMAN.recordedBoardPosition};
		switch (PACMAN.direction) {
			case "down":
				if (offsetTile.by < GameBoard.height - 3) {
					offsetTile.by += 2;
				} else {
					offsetTile.by = GameBoard.height - 1;
				}
				break;
			case "up":
				if (offsetTile.by > 2) {
					offsetTile.by -= 2;
				} else {
					offsetTile.by = 0;
				}
				if (offsetTile.bx > 2) {
					offsetTile.bx -= 2;
				} else {
					offsetTile.bx = 0;
				}
				break;
			case "left":
				if (offsetTile.bx > 2) {
					offsetTile.bx -= 2;
				} else {
					offsetTile.bx = 0;
				}
				break;
			case "right":
				if (offsetTile.bx < GameBoard.width - 3) {
					offsetTile.bx += 2;
				} else {
					offsetTile.bx = GameBoard.width - 1
				}
				break;
		}
		const differenceVector: vector = {
			x: offsetTile.bx - this._blinkyRef.recordedBoardPosition.bx,
			y: offsetTile.by - this._blinkyRef.recordedBoardPosition.by
		}

		offsetTile.bx += 2 * differenceVector.x;
		offsetTile.by += 2 * differenceVector.y;

		if (offsetTile.bx < 0) offsetTile.bx = 0;
		else if (offsetTile.bx >= GameBoard.width) offsetTile.bx = GameBoard.width - 1;

		if (offsetTile.by < 0) offsetTile.by = 0;
		else if (offsetTile.by >= GameBoard.height) offsetTile.by = GameBoard.height - 1;


		return offsetTile;
	}

	updateFrame(frameNo: number): RenderObject {
		// console.log("%cProcessing Inky", 'color: #00ffff;');
		return super.updateFrame(frameNo);
	}
	
}

export { Inky };