import { Entity } from "../entity.js";
import { spriteManager } from "../spriteManager.js";
import { RenderObject, coordinate } from "../types.js";

abstract class Ghost extends Entity {
	protected state: ("chase" | "scatter" | "frightened" | "eyes") = "chase"
	protected __frightTimer = 0;
	protected __frightStart = 0;
	
	updateFrame(frameNo: number): RenderObject {
		const progress = frameNo - this.__startTime;

		// Check if frightened
		if (this.state == "frightened") {
			if (frameNo - this.__frightStart >= this.__frightTimer) {
				this.state = "chase";
			}
		}

		return {
			placementCoords: {
				x: this.__startPosition.x + this.__currentVector.x * progress,
				y: this.__startPosition.y + this.__currentVector.y * progress,
			},
			sheetCoords: this._imageDeterminer(frameNo)
		}
	}

	scareMe(frameTimer: number, currFrame: number) {
		this.state = "frightened";
		this.__frightStart = currFrame;
		this.__frightTimer = frameTimer;
	}

	private _imageDeterminer(frameNo: number): coordinate {
		if (this.state === "frightened") {
			const frightProgression = frameNo - this.__frightStart;

			const indexName = (this.__frightTimer - frightProgression <= 120) ? "ghostSkeptical" : "ghostFrightened";
			const animLength = spriteManager[indexName].length;
			const frameNumer = Math.floor(frightProgression / Entity._FRAMES_PER_IMAGE) % animLength

			
			return spriteManager[indexName][frameNumer];
		} else if (this.state === "eyes") {
			const progression = frameNo - this.__startTime;

			const indexName = "eyes";
			const animLength = spriteManager[indexName].length;
			const frameNumer = Math.floor(progression / Entity._FRAMES_PER_IMAGE) % animLength
		} else {
			const progression = frameNo - this.__startTime;

			const indexName = this.__animationInfo[this.__direction];
			const animLength = spriteManager[indexName].length;
			const frameNumer = Math.floor(progression / Entity._FRAMES_PER_IMAGE) % animLength

			return spriteManager[indexName][frameNumer];
		}
	}
}


export { Ghost }