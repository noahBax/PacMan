import { GameBoard } from "../gameBoard.js";
import { Ghost } from "./ghost.js";
class Inky extends Ghost {
    constructor(pacmanRef, gameBoard) {
        super(pacmanRef, gameBoard);
        this.PET_NAME = "Inky";
        this.__startPositionForVector = { cy: 512, cx: 416 };
        this.recordedBoardLocation = { by: 32, bx: 26 };
        this.direction = "left";
        this.__currentVector = Ghost.getVectorFromDirection("left");
        this.targetCoord = { by: 32, bx: 25 };
        this.__latentMoveInformation = {
            baseCoordinate: { by: 32, bx: 26 },
            coord: { by: 32, bx: 25 },
            direction: "left"
        };
        this.__animationInfo = {
            down: "inkyDown",
            left: "inkyLeft",
            right: "inkyRight",
            up: "inkyUp"
        };
    }
    getTarget(frameNo) {
        let coordRn = { ...this.__pacmanReference.recordedBoardPosition };
        switch (this.__pacmanReference.direction) {
            case "down":
                if (coordRn.by < GameBoard.height - 5) {
                    coordRn.by += 4;
                }
                else {
                    coordRn.by = GameBoard.height - 1;
                }
                return coordRn;
            case "up":
                if (coordRn.by > 4) {
                    coordRn.by -= 4;
                }
                else {
                    coordRn.by = 0;
                }
                return coordRn;
            case "left":
                if (coordRn.bx > 4) {
                    coordRn.bx -= 4;
                }
                else {
                    coordRn.bx = 0;
                }
                return coordRn;
            case "right":
                if (coordRn.bx < GameBoard.width - 5) {
                    coordRn.bx += 4;
                }
                else {
                    coordRn.bx = GameBoard.width - 1;
                }
                return coordRn;
        }
    }
    updateFrame(frameNo) {
        console.log("%cProcessing Inky", 'color: #00ffff;');
        return super.updateFrame(frameNo);
    }
}
export { Inky };
