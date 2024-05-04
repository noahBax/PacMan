import { PACMAN } from "../director.js";
import GameBoard from "../gameBoard.js";
import { GhostIDs, GhostNames } from "../types.js";
import { penVectorFromDirection } from "../utilities.js";
import Ghost from "./ghost.js";
class Inky extends Ghost {
    constructor(blinkyRef) {
        super();
        this.__ghostNumber = GhostIDs.INKY;
        this.PET_NAME = GhostNames.INKY;
        this.__startPositionForVector = { cy: 272, cx: 184 };
        this.recordedBoardPosition = { by: 14, bx: 13 };
        this.direction = "down";
        this.__currentVector = penVectorFromDirection["down"];
        this.targetCoord = { by: 14, bx: 23 };
        this.__latentMoveInformation = {
            baseCoordinate: { by: 14, bx: 22 },
            coord: { by: 14, bx: 23 },
            direction: "down"
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
        let offsetTile = { ...PACMAN.recordedBoardPosition };
        switch (PACMAN.direction) {
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
        // console.log("%cProcessing Inky", 'color: #00ffff;');
        return super.updateFrame(frameNo);
    }
}
export default Inky;
