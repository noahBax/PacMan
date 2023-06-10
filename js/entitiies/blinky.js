import { Ghost } from "./ghost.js";
class Blinky extends Ghost {
    constructor(pacmanRef, gameBoard) {
        super(pacmanRef, gameBoard);
        this.PET_NAME = "Blinky";
        this.__startPositionForVector = { cy: 16 * 14, cx: 13 * 16 };
        this.recordedBoardLocation = { by: 14, bx: 13 };
        this.direction = "left";
        this.__currentVector = Ghost.vectorFromDirection["left"];
        this.targetCoord = { by: 14, bx: 12 };
        this.__latentMoveInformation = {
            baseCoordinate: { by: 14, bx: 13 },
            coord: { by: 14, bx: 12 },
            direction: "left"
        };
        this.__animationInfo = {
            down: "blinkyDown",
            left: "blinkyLeft",
            right: "blinkyRight",
            up: "blinkyUp"
        };
    }
    getTarget(frameNo) {
        return this.__pacmanReference.recordedBoardPosition;
    }
    updateFrame(frameNo) {
        console.log("%cProcessing Blinky", 'color: #ff0000;');
        return super.updateFrame(frameNo);
    }
}
export { Blinky };
