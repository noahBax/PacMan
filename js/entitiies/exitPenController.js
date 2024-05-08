import { penVectorFromDirection } from "../utilities.js";
export var LAST_FLAG;
(function (LAST_FLAG) {
    LAST_FLAG[LAST_FLAG["NOT_IN_PEN"] = 0] = "NOT_IN_PEN";
    LAST_FLAG[LAST_FLAG["TOWARDS_CENTER"] = 1] = "TOWARDS_CENTER";
    LAST_FLAG[LAST_FLAG["HEADING_UP"] = 2] = "HEADING_UP";
    LAST_FLAG[LAST_FLAG["EXITED_TOP"] = 3] = "EXITED_TOP";
})(LAST_FLAG || (LAST_FLAG = {}));
class ExitPenController {
    constructor() {
        this.lastFlag = LAST_FLAG.NOT_IN_PEN;
        this.direction = "down";
        this.vector = { x: 0, y: 0 };
    }
    updateDirection(boardPosition, canvasPosition) {
        if (this.lastFlag < LAST_FLAG.TOWARDS_CENTER) {
            // Oscillate around the y = 17 mark
            if (this.direction == "up" && boardPosition.by < 17) {
                this.direction = "down";
                this.vector = penVectorFromDirection["down"];
                return true;
            }
            if (this.direction == "down" && boardPosition.by > 17) {
                this.direction = "up";
                this.vector = penVectorFromDirection["up"];
                return true;
            }
            return false;
        }
        if (this.lastFlag < LAST_FLAG.HEADING_UP &&
            (this.direction == "left" && boardPosition.bx < 14 ||
                this.direction == "right" && boardPosition.bx > 13)) {
            this.vector = penVectorFromDirection["up"];
            this.direction = "up";
            this.lastFlag = LAST_FLAG.HEADING_UP;
            return true;
        }
        if (this.lastFlag < LAST_FLAG.EXITED_TOP && this.direction == "up" && canvasPosition.cy <= 14 * 16) {
            this.lastFlag = LAST_FLAG.EXITED_TOP;
            return true;
        }
        return false;
    }
    startExitingPen(boardPosition) {
        this.lastFlag = LAST_FLAG.TOWARDS_CENTER;
        if (boardPosition.bx < 14) {
            this.direction = "right";
            this.vector = penVectorFromDirection["right"];
        }
        else if (boardPosition.bx > 14) {
            this.direction = "left";
            this.vector = penVectorFromDirection["left"];
        }
        else {
            this.vector = penVectorFromDirection["up"];
            this.direction = "up";
            this.lastFlag = LAST_FLAG.HEADING_UP;
        }
    }
}
export default ExitPenController;
