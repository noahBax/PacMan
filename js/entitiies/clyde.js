import { Ghost } from "./ghost.js";
class Clyde extends Ghost {
    constructor(pacmanRef) {
        super(pacmanRef);
        this.__startPosition = { cx: 16, cy: 528 };
        this.direction = "right";
        this.__currentVector = Ghost.getVectorFromDirection("right");
        this.__animationInfo = {
            down: "clydeDown",
            left: "clydeLeft",
            right: "clydeRight",
            up: "clydeUp"
        };
        this.__lastRecordedLocation = { bx: 0, by: 0 };
    }
    getTarget() {
        return { bx: 0, by: 0 };
    }
    updateFrame(frameNo) {
        console.log("Processing Clyde");
        return super.updateFrame(frameNo);
    }
}
export { Clyde };
