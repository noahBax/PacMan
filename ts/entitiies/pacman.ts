import { Entity } from "../entity.js";
import { GameBoard } from "../gameBoard.js";
import { spriteManager } from "../spriteManager.js";
import { Direction, canvasCoordinate, vector, RenderObject, animationInfo, boardCoordinate } from "../types.js";

class PacMan extends Entity{
	static SPEED = 1;

	protected __startPosition: canvasCoordinate = {cx: 216, cy: 320}
	private _animationState: ("normal" | "dying") = "normal";

	currentBoardPosition: boardCoordinate;

	protected __animationInfo: animationInfo = {
		down: "pacDown",
		up: "pacUp",
		left: "pacLeft",
		right: "pacRight",
		static: "pacStatic"
	};
	
	updateFrame(frameNo: number): RenderObject {
		const progress = frameNo - this.__startTime;
		
		// Set our coordinates for the stupid ghosts
		this.currentBoardPosition = GameBoard.getPositionOnBoardGrid(this.getCurrentPosition(frameNo));


		return {
			placementCoords: {
				cx: this.__startPosition.cx + this.__currentVector.x * progress,
				cy: this.__startPosition.cy + this.__currentVector.y * progress,
			},
			sheetCoords: this._imageDeterminer(frameNo)
		};
	}

	_imageDeterminer(frameNo: number): canvasCoordinate {
		if (this._animationState == "normal") {
			const progression = frameNo - this.__startTime;

			const indexName = this.__animationInfo[this.direction]
			const animLength = spriteManager[indexName].length;
			const frameNumer = Math.floor(progression / Entity._FRAMES_PER_IMAGE) % animLength

			return spriteManager[indexName][frameNumer];
		}
	}
	
}

export { PacMan };