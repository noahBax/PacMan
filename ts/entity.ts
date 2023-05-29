import { PacMan } from "./entitiies/pacman.js";
import { Direction, RenderObject, animationInfo, canvasCoordinate, vector } from "./types.js";

abstract class Entity {
	static readonly _FRAMES_PER_IMAGE = 6;

	protected abstract __startPositionForVector: canvasCoordinate
	protected abstract __currentVector: vector
	protected __startTime = 0;
	protected __pacmanReference: PacMan;
	protected abstract __animationInfo: animationInfo;
	direction: Direction = "right";

	abstract updateFrame(frameNo: number): RenderObject;

	setInitial(coords: false | canvasCoordinate, vector: false | vector, currFrame: number) {
		this.__startPositionForVector = coords || {
				cx: this.__startPositionForVector.cx + this.__currentVector.x * (currFrame - this.__startTime),
				cy: this.__startPositionForVector.cy + this.__currentVector.y * (currFrame - this.__startTime)
			};
		this.__currentVector = vector || this.__currentVector;
		this.__startTime = currFrame;
	}
	
	/**
	 * Position is just calculated by frames passed multiplied by a vector
	 */
	getCurrentPosition(frameNo: number): canvasCoordinate {
		const delta = frameNo - this.__startTime;
		return {
			cx: this.__startPositionForVector.cx + this.__currentVector.x * delta,
			cy: this.__startPositionForVector.cy + this.__currentVector.y * delta,
		}
	}

}

export { Entity };