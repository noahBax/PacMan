import { Ghost } from "./ghost.js";
class Clyde extends Ghost {
    constructor(pacmanRef) {
        super(pacmanRef);
        this.PET_NAME = "Clyde";
        this.__currentBoardLocation = { by: 32, bx: 1 };
        this.__startPositionForVector = { cy: 32 * 16, cx: 16, };
        this.direction = "right";
        this.__currentVector = Ghost.getVectorFromDirection("right");
        this.__animationInfo = {
            down: "clydeDown",
            left: "clydeLeft",
            right: "clydeRight",
            up: "clydeUp"
        };
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
