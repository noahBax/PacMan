import { PACMAN } from "../director.js";
import { GameBoard } from "../gameBoard.js";
import { GhostNames } from "../types.js";
import { penVectorFromDirection } from "../utilities.js";
import { Ghost } from "./ghost.js";
class Clyde extends Ghost {
    constructor() {
        super();
        this.PET_NAME = GhostNames.CLYDE;
        this.__startPositionForVector = { cy: 272, cx: 248 };
        this.recordedBoardPosition = { by: 14, bx: 13 };
        this.direction = "down";
        this.__currentVector = penVectorFromDirection["down"];
        this.targetCoord = { by: 32, bx: 2 };
        this.__latentMoveInformation = {
            baseCoordinate: { by: 14, bx: 23 },
            coord: { by: 14, bx: 22 },
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
        const pacmanPos = PACMAN.recordedBoardPosition;
        const distanceToPacman = (this.recordedBoardPosition.bx - pacmanPos.bx) ** 2 + (this.recordedBoardPosition.by - pacmanPos.by) ** 2;
        if (distanceToPacman < 64)
            return this.scatterTarget;
        let pos = { ...PACMAN.recordedBoardPosition };
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
        // console.log("%cProcessing Clyde", "color: #F8BB55;");
        return super.updateFrame(frameNo);
    }
}
export { Clyde };
