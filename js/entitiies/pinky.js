import { Ghost } from "./ghost.js";
class Pinky extends Ghost {
    constructor(pacmanRef, gameBoard) {
        super(pacmanRef, gameBoard);
        this.PET_NAME = "Pinky";
        this.__startPositionForVector = { cy: 64, cx: 16 };
        this.recordedBoardLocation = { by: 4, bx: 1 };
        this.direction = "right";
        this.__currentVector = Ghost.vectorFromDirection["right"];
        this.targetCoord = { by: 4, bx: 2 };
        this.__latentMoveInformation = {
            baseCoordinate: { by: 4, bx: 1 },
            coord: { by: 4, bx: 2 },
            direction: "right"
        };
        this.__animationInfo = {
            down: "pinkyDown",
            left: "pinkyLeft",
            right: "pinkyRight",
            up: "pinkyUp"
        };
    }
    getTarget(frameNo) {
        // return this.__pacmanReference.getBoardCoordinates(frameNo);
        return this.__pacmanReference.recordedBoardPosition;
    }
    updateFrame(frameNo) {
        console.log("%cProcessing Pinky", 'color: #FCB5FF;');
        return super.updateFrame(frameNo);
    }
}
export { Pinky };
