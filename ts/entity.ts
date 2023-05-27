import { PacMan } from "./entitiies/pacman.js";
import { Direction, RenderObject, animationInfo, canvasCoordinate, vector } from "./types.js";

abstract class Entity {
	static readonly _FRAMES_PER_IMAGE = 6;

	protected __startPosition: canvasCoordinate = {cx: 0, cy: 0};
	protected __currentVector: vector = {x: 0, y: 0};
	protected __startTime = 0;
	protected __pacmanReference: PacMan;
	protected abstract __animationInfo: animationInfo;
	direction: Direction = "right";

	abstract updateFrame(frameNo: number): RenderObject;

	setInitial(coords: false | canvasCoordinate, vector: false | vector, currFrame: number) {
		this.__startPosition = coords || {
				cx: this.__startPosition.cx + this.__currentVector.x * (currFrame - this.__startTime),
				cy: this.__startPosition.cy + this.__currentVector.y * (currFrame - this.__startTime)
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
			cx: this.__startPosition.cx + this.__currentVector.x * delta,
			cy: this.__startPosition.cy + this.__currentVector.y * delta,
		}
	}

}

export { Entity };