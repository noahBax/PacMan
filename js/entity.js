class Entity {
    constructor() {
        this.__startPosition = { x: 0, y: 0 };
        this.__currentVector = { x: 0, y: 0 };
        this.__direction = "right";
    }
    setInitial(coords, vector, currFrame) {
        this.__startPosition = coords || {
            x: this.__startPosition.x + this.__currentVector.x * (currFrame - this.__startTime),
            y: this.__startPosition.y + this.__currentVector.y * (currFrame - this.__startTime)
        };
        this.__currentVector = vector || this.__currentVector;
        this.__startTime = currFrame;
    }
}
Entity._FRAMES_PER_IMAGE = 6;
export { Entity };
