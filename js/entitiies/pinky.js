import { Ghost } from "./ghost.js";
class Pinky extends Ghost {
    constructor(pacmanRef) {
        super(pacmanRef);
        this.__currentBoardLocation = { by: 4, bx: 1 };
        this.__startPositionForVector = { cy: 64, cx: 16 };
        this.direction = "right";
        this.__currentVector = Ghost.getVectorFromDirection("right");
        this.__animationInfo = {
            down: "pinkyDown",
            left: "pinkyLeft",
            right: "pinkyRight",
            up: "pinkyUp"
        };
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
