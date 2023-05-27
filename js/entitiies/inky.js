import { Ghost } from "./ghost.js";
class Inky extends Ghost {
    constructor(pacmanRef) {
        super(pacmanRef);
        this.__startPosition = { cx: 416, cy: 512 };
        this.direction = "left";
        this.__currentVector = Ghost.getVectorFromDirection("left");
        this.__animationInfo = {
            down: "inkyDown",
            left: "inkyLeft",
            right: "inkyRight",
            up: "inkyUp"
        };
        this.__lastRecordedLocation = { bx: 0, by: 0 };
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
