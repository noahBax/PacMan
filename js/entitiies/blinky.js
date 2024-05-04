import { PACMAN } from "../director.js";
import { GameBoard } from "../gameBoard.js";
import MonsterState from "../monsterState.js";
import { GhostNames } from "../types.js";
import { vectorFromDirection } from "../utilities.js";
import { Ghost } from "./ghost.js";
class Blinky extends Ghost {
    constructor() {
        super();
        this.PET_NAME = GhostNames.BLINKY;
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
        this.__state = MonsterState.CHASE_MODE;
    }
    getTarget(frameNo) {
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
        // console.log("%cProcessing Blinky", 'color: #ff0000;');
        return super.updateFrame(frameNo);
    }
}
export { Blinky };
