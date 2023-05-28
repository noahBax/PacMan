import { Entity } from "../entity.js";
import { GameBoard } from "../gameBoard.js";
import { spriteManager } from "../spriteManager.js";
class PacMan extends Entity {
    constructor() {
        super(...arguments);
        this.__startPositionForVector = { cx: 216, cy: 320 };
        this._animationState = "normal";
        this.currentBoardPosition = { bx: 13, by: 20 };
        this.__animationInfo = {
            down: "pacDown",
            up: "pacUp",
            left: "pacLeft",
            right: "pacRight",
            static: "pacStatic"
        };
    }
    updateFrame(frameNo) {
        const progress = frameNo - this.__startTime;
        // Set our coordinates for the stupid ghosts
        this.currentBoardPosition = GameBoard.getPositionOnBoardGrid(this.getCurrentPosition(frameNo));
        return {
            placementCoords: {
                cx: this.__startPositionForVector.cx + this.__currentVector.x * progress,
                cy: this.__startPositionForVector.cy + this.__currentVector.y * progress,
            },
            sheetCoords: this._imageDeterminer(frameNo)
        };
    }
    _imageDeterminer(frameNo) {
        if (this._animationState == "normal") {
            const progression = frameNo - this.__startTime;
            const indexName = this.__animationInfo[this.direction];
            const animLength = spriteManager[indexName].length;
            const frameNumer = Math.floor(progression / Entity._FRAMES_PER_IMAGE) % animLength;
            return spriteManager[indexName][frameNumer];
        }
    }
}
PacMan.SPEED = 1;
export { PacMan };
