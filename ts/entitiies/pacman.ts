import { Entity } from "../entity.js";
import { spriteManager } from "../spriteManager.js";
import { Direction, coordinate, vector, RenderObject, animationInfo } from "../types.js";

class PacMan extends Entity{
	static VELOCITY = 3;

	private _animationState: ("normal" | "dying") = "normal";

	protected __animationInfo: animationInfo = {
		down: "pacDown",
		up: "pacUp",
		left: "pacLeft",
		right: "pacRight",
	};
	
	updateFrame(frameNo: number): RenderObject {
		const progress = frameNo - this.__startTime;
		return {
			placementCoords: {
				x: this.__startPosition.x + this.__currentVector.x * progress,
				y: this.__startPosition.y + this.__currentVector.y * progress,
			},
			sheetCoords: this._imageDeterminer(frameNo)
		};
	}

	_imageDeterminer(frameNo: number): coordinate {
		if (this._animationState == "normal") {
			const progression = frameNo - this.__startTime;

			const indexName = this.__animationInfo[this.__direction]
			const animLength = spriteManager[indexName].length;
			const frameNumer = Math.floor(progression / Entity._FRAMES_PER_IMAGE) % animLength

			return spriteManager[indexName][frameNumer];
		}
	}
	
}

export { PacMan };