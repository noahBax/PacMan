import { Ghost } from "./ghost.js";
class Clyde extends Ghost {
    constructor(pacmanRef, gameBoard) {
        super(pacmanRef, gameBoard);
        this.PET_NAME = "Clyde";
        this.__startPositionForVector = { cy: 32 * 16, cx: 16, };
        this.recordedBoardLocation = { by: 32, bx: 1 };
        this.direction = "right";
        this.__currentVector = Ghost.getVectorFromDirection("right");
        this.targetCoord = { by: 32, bx: 2 };
        this.__latentMoveInformation = {
            baseCoordinate: { by: 32, bx: 1 },
            coord: { by: 32, bx: 2 },
            direction: "left"
        };
        this.__animationInfo = {
            down: "clydeDown",
            left: "clydeLeft",
            right: "clydeRight",
            up: "clydeUp"
        };
    }
    getTarget(frameNo) {
        // return this.__pacmanReference.getBoardCoordinates(frameNo);
        return this.__pacmanReference.recordedBoardPosition;
    }
    updateFrame(frameNo) {
        console.log("%cProcessing Clyde", "color: #F8BB55;");
        return super.updateFrame(frameNo);
    }
}
export { Clyde };
