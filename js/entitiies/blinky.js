import { GameBoard } from "../gameBoard.js";
import { vectorFromDirection } from "../utilities.js";
import { Ghost } from "./ghost.js";
class Blinky extends Ghost {
    constructor(pacmanRef, gameBoard) {
        super(pacmanRef, gameBoard);
        this.PET_NAME = "Blinky";
        this.__startPositionForVector = { cy: 16 * 14, cx: 13 * 16 };
        this.recordedBoardPosition = { by: 14, bx: 13 };
        this.direction = "left";
        this.__currentVector = vectorFromDirection["left"];
        this.targetCoord = { by: 14, bx: 12 };
        this.__latentMoveInformation = {
            baseCoordinate: { by: 14, bx: 13 },
            coord: { by: 14, bx: 12 },
            direction: "left"
        };
        this.scatterTarget = {
            by: 0,
            bx: 25
        };
        this.__animationInfo = {
            down: "blinkyDown",
            left: "blinkyLeft",
            right: "blinkyRight",
            up: "blinkyUp"
        };
        this.monsterPenState = 2;
    }
    getTarget(frameNo) {
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
        // console.log("%cProcessing Blinky", 'color: #ff0000;');
        return super.updateFrame(frameNo);
    }
}
export { Blinky };
