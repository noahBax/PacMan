import { Ghost } from "./ghost.js";
class Blinky extends Ghost {
    constructor(pacmanRef) {
        super(pacmanRef);
        this.__startPosition = { cx: 216, cy: 225 };
        this.direction = "left";
        this.__currentVector = Ghost.getVectorFromDirection("left");
        this.__animationInfo = {
            down: "blinkyDown",
            left: "blinkyLeft",
            right: "blinkyRight",
            up: "blinkyUp"
        };
        this.__lastRecordedLocation = { bx: 0, by: 0 };
    }
    getTarget() {
        return this.__pacmanReference.currentBoardPosition;
    }
    updateFrame(frameNo) {
        console.log("Processing Blinky");
        return super.updateFrame(frameNo);
    }
}
export { Blinky };
