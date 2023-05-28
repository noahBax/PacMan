import { Ghost } from "./ghost.js";
class Inky extends Ghost {
    constructor(pacmanRef) {
        super(pacmanRef);
        this.__currentLocation = { by: 32, bx: 25 };
        this.__startPositionForVector = { cy: 512, cx: 416 };
        this.direction = "left";
        this.__currentVector = Ghost.getVectorFromDirection("left");
        this.__animationInfo = {
            down: "inkyDown",
            left: "inkyLeft",
            right: "inkyRight",
            up: "inkyUp"
        };
    }
    getTarget() {
        let coordRn = { ...this.__pacmanReference.currentBoardPosition };
        switch (this.__pacmanReference.direction) {
            case "down":
                coordRn.by += 4;
                return coordRn;
            case "up":
                coordRn.by -= 4;
                return coordRn;
            case "left":
                coordRn.bx -= 4;
                return coordRn;
            case "right":
                coordRn.bx += 4;
                return coordRn;
        }
    }
    updateFrame(frameNo) {
        console.log("Processing Inky");
        return super.updateFrame(frameNo);
    }
}
export { Inky };
