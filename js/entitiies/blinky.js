import { Ghost } from "./ghost.js";
class Blinky extends Ghost {
    constructor(pacmanRef) {
        super(pacmanRef);
        this.__startPositionForVector = { cy: 16 * 14, cx: 13 * 16 };
        this.__currentBoardLocation = { by: 14, bx: 13 };
        this.direction = "left";
        this.__currentVector = Ghost.getVectorFromDirection("left");
        this.__animationInfo = {
            down: "blinkyDown",
            left: "blinkyLeft",
            right: "blinkyRight",
            up: "blinkyUp"
        };
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
