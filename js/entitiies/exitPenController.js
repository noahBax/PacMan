import { penVectorFromDirection, vectorFromDirection } from "../utilities.js";
class ExitPenController {
    constructor() {
        /**
         * 0 - Not exiting
         * 1 - Going towards center
         * 2 - Exiting top
        */
        this.stage = 0;
        this.direction = "up";
        this.vector = { x: 0, y: 0 };
    }
    updateDirection(boardPosition) {
        if (this.stage == 1 &&
            (this.direction == "left" && boardPosition.bx < 14 ||
                this.direction == "right" && boardPosition.bx < 13)) {
            this.vector = penVectorFromDirection["up"];
            this.direction = "up";
            this.stage = 2;
            return true;
        }
        if (this.stage == 2 && this.direction == "up" && boardPosition.by == 14) {
            this.vector = vectorFromDirection["left"];
            this.direction = "left";
            this.stage = 0;
            return true;
        }
        return false;
    }
    startExitingPen(boardPosition) {
        this.stage = 1;
        if (boardPosition.bx < 14) {
            this.direction = "left";
            this.vector = penVectorFromDirection["left"];
        }
        else {
            this.direction = "right";
            this.vector = penVectorFromDirection["right"];
        }
    }
}
export default ExitPenController;
