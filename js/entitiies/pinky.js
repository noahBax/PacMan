import { Ghost } from "./ghost.js";
class Pinky extends Ghost {
    constructor(pacmanRef) {
        super(pacmanRef);
        this.__startPosition = { cx: 16, cy: 64 };
        this.direction = "right";
        this.__currentVector = Ghost.getVectorFromDirection("right");
        this.__animationInfo = {
            down: "pinkyDown",
            left: "pinkyLeft",
            right: "pinkyRight",
            up: "pinkyUp"
        };
        this.__lastRecordedLocation = { bx: 0, by: 0 };
    }
    getTarget() {
        return { bx: 0, by: 0 };
    }
    updateFrame(frameNo) {
        console.log("Processing Pinky");
        return super.updateFrame(frameNo);
    }
}
export { Pinky };
