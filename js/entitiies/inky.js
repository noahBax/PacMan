import { GameBoard } from "../gameBoard.js";
import { Ghost } from "./ghost.js";
class Inky extends Ghost {
    constructor(pacmanRef, blinkyRef, gameBoard) {
        super(pacmanRef, gameBoard);
        this.PET_NAME = "Inky";
        this.__startPositionForVector = { cy: 512, cx: 416 };
        this.recordedBoardPosition = { by: 32, bx: 26 };
        this.direction = "left";
        this.__currentVector = Ghost.vectorFromDirection["left"];
        this.targetCoord = { by: 32, bx: 25 };
        this.__latentMoveInformation = {
            baseCoordinate: { by: 32, bx: 26 },
            coord: { by: 32, bx: 25 },
            direction: "left"
        };
        this.scatterTarget = {
            by: 35,
            bx: 27
        };
        this.__animationInfo = {
            down: "inkyDown",
            left: "inkyLeft",
            right: "inkyRight",
            up: "inkyUp"
        };
        this._blinkyRef = blinkyRef;
    }
    getTarget(frameNo) {
        let offsetTile = { ...this.__pacmanReference.recordedBoardPosition };
        switch (this.__pacmanReference.direction) {
            case "down":
                if (offsetTile.by < GameBoard.height - 3) {
                    offsetTile.by += 2;
                }
                else {
                    offsetTile.by = GameBoard.height - 1;
                }
                break;
            case "up":
                if (offsetTile.by > 2) {
                    offsetTile.by -= 2;
                }
                else {
                    offsetTile.by = 0;
                }
                if (offsetTile.bx > 2) {
                    offsetTile.bx -= 2;
                }
                else {
                    offsetTile.bx = 0;
                }
                break;
            case "left":
                if (offsetTile.bx > 2) {
                    offsetTile.bx -= 2;
                }
                else {
                    offsetTile.bx = 0;
                }
                break;
            case "right":
                if (offsetTile.bx < GameBoard.width - 3) {
                    offsetTile.bx += 2;
                }
                else {
                    offsetTile.bx = GameBoard.width - 1;
                }
                break;
        }
        const differenceVector = {
            x: offsetTile.bx - this._blinkyRef.recordedBoardPosition.bx,
            y: offsetTile.by - this._blinkyRef.recordedBoardPosition.by
        };
        offsetTile.bx += 2 * differenceVector.x;
        offsetTile.by += 2 * differenceVector.y;
        if (offsetTile.bx < 0)
            offsetTile.bx = 0;
        else if (offsetTile.bx >= GameBoard.width)
            offsetTile.bx = GameBoard.width - 1;
        if (offsetTile.by < 0)
            offsetTile.by = 0;
        else if (offsetTile.by >= GameBoard.height)
            offsetTile.by = GameBoard.height - 1;
        return offsetTile;
    }
    updateFrame(frameNo) {
        console.log("%cProcessing Inky", 'color: #00ffff;');
        return super.updateFrame(frameNo);
    }
}
export { Inky };
