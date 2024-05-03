import { GameBoard } from "../gameBoard.js";
import { penVectorFromDirection } from "../utilities.js";
import { Ghost } from "./ghost.js";
class Pinky extends Ghost {
    constructor(pacmanRef, gameBoard) {
        super(pacmanRef, gameBoard);
        this.PET_NAME = "Pinky";
        this.__startPositionForVector = { cy: 272, cx: 216 };
        this.recordedBoardPosition = { by: 14, bx: 13 };
        this.direction = "down";
        this.__currentVector = penVectorFromDirection["down"];
        this.targetCoord = { by: 32, bx: 2 };
        this.__latentMoveInformation = {
            baseCoordinate: { by: 14, bx: 23 },
            coord: { by: 14, bx: 22 },
            direction: "down"
        };
        this.scatterTarget = {
            by: 0,
            bx: 2
        };
        this.__animationInfo = {
            down: "pinkyDown",
            left: "pinkyLeft",
            right: "pinkyRight",
            up: "pinkyUp"
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
                if (coordRn.bx > 4) {
                    coordRn.bx -= 4;
                }
                else {
                    coordRn.bx = 0;
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
        // return this.__pacmanReference.getBoardCoordinates(frameNo);
    }
    updateFrame(frameNo) {
        // console.log("%cProcessing Pinky", 'color: #FCB5FF;');
        return super.updateFrame(frameNo);
    }
}
export { Pinky };
