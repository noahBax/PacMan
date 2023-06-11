import { GameBoard } from "../gameBoard.js";
import { Ghost } from "./ghost.js";
class Clyde extends Ghost {
    constructor(pacmanRef, gameBoard) {
        super(pacmanRef, gameBoard);
        this.PET_NAME = "Clyde";
        this.__startPositionForVector = { cy: 32 * 16, cx: 16, };
        this.recordedBoardPosition = { by: 32, bx: 1 };
        this.direction = "right";
        this.__currentVector = Ghost.vectorFromDirection["right"];
        this.targetCoord = { by: 32, bx: 2 };
        this.__latentMoveInformation = {
            baseCoordinate: { by: 32, bx: 1 },
            coord: { by: 32, bx: 2 },
            direction: "left"
        };
        this.scatterTarget = {
            by: 35,
            bx: 0
        };
        this.__animationInfo = {
            down: "clydeDown",
            left: "clydeLeft",
            right: "clydeRight",
            up: "clydeUp"
        };
    }
    getTarget(frameNo) {
        const pacmanPos = this.__pacmanReference.recordedBoardPosition;
        const distanceToPacman = (this.recordedBoardPosition.bx - pacmanPos.bx) ** 2 + (this.recordedBoardPosition.by - pacmanPos.by) ** 2;
        if (distanceToPacman < 64)
            return this.scatterTarget;
        let pos = { ...this.__pacmanReference.recordedBoardPosition };
        if (pos.bx < 0)
            pos.bx = 0;
        else if (pos.bx >= GameBoard.width)
            pos.bx = GameBoard.width - 1;
        if (pos.by < 0)
            pos.by = 0;
        else if (pos.by >= GameBoard.height)
            pos.by = GameBoard.height - 1;
        return pos;
    }
    updateFrame(frameNo) {
        console.log("%cProcessing Clyde", "color: #F8BB55;");
        return super.updateFrame(frameNo);
    }
}
export { Clyde };
