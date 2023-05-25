import { Direction, RenderObject, animationInfo, coordinate, vector } from "./types.js";

abstract class Entity {
	static readonly _FRAMES_PER_IMAGE = 6;

	protected __startPosition: coordinate = {x: 0, y: 0};
	protected __currentVector: vector = {x: 0, y: 0};
	protected __startTime: number;
	protected abstract __animationInfo: animationInfo;
	__direction: Direction = "right";

	abstract updateFrame(frameNo: number): RenderObject;

	setInitial(coords: false | coordinate, vector: false | vector, currFrame: number) {
		this.__startPosition = coords || {
				x: this.__startPosition.x + this.__currentVector.x * (currFrame - this.__startTime),
				y: this.__startPosition.y + this.__currentVector.y * (currFrame - this.__startTime)
			};
		this.__currentVector = vector || this.__currentVector;
		this.__startTime = currFrame;
	}
	
	

}

export { Entity };