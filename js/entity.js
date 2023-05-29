class Entity {
    constructor() {
        this.__startTime = 0;
        this.direction = "right";
    }
    setInitial(coords, vector, currFrame) {
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
    getCurrentPosition(frameNo) {
        const delta = frameNo - this.__startTime;
        return {
            cx: this.__startPositionForVector.cx + this.__currentVector.x * delta,
            cy: this.__startPositionForVector.cy + this.__currentVector.y * delta,
        };
    }
}
Entity._FRAMES_PER_IMAGE = 6;
export { Entity };
