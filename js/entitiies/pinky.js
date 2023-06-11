import { GameBoard } from "../gameBoard.js";
import { Ghost } from "./ghost.js";
class Pinky extends Ghost {
    constructor(pacmanRef, gameBoard) {
        super(pacmanRef, gameBoard);
        this.PET_NAME = "Pinky";
        this.__startPositionForVector = { cy: 64, cx: 16 };
        this.recordedBoardPosition = { by: 4, bx: 1 };
        this.direction = "right";
        this.__currentVector = Ghost.vectorFromDirection["right"];
        this.targetCoord = { by: 4, bx: 2 };
        this.__latentMoveInformation = {
            baseCoordinate: { by: 4, bx: 1 },
            coord: { by: 4, bx: 2 },
            direction: "right"
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
        console.log("%cProcessing Pinky", 'color: #FCB5FF;');
        return super.updateFrame(frameNo);
    }
}
export { Pinky };
