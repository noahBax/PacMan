import { DRIVING_SPEED } from "../constants.js";
import Entity from "../entity.js";
import GameBoard from "../gameBoard.js";
import spriteManager from "../spriteManager.js";
import { vectorFromDirection } from "../utilities.js";
class PacMan extends Entity {
    constructor() {
        super(...arguments);
        this.PET_NAME = "Pac-Man";
        this.__currentVector = { x: 0, y: 0 };
        this.__startPositionForVector = { cx: 216, cy: 320 };
        this._animationState = "normal";
        this._isCornering = false;
        this.direction = "right";
        this._previousDirection = "right";
        this.recordedBoardPosition = { bx: 14, by: 20 };
        this._haveCheckedForWall = true;
        this.__animationInfo = {
            down: "pacDown",
            up: "pacUp",
            left: "pacLeft",
            right: "pacRight",
            none: "pacStatic"
        };
    }
    setController(controller) {
        this._controller = controller;
    }
    updateFrame(frameNo) {
        this.purgatoryCheck(frameNo);
        let currentCanvasPos = this.getCanvasCoords(frameNo);
        let currentBoardPos = this.getBoardCoordinatesCentered(frameNo);
        /**
         * Some things to consider
         * If pacman is moving, and nothing is changing then we don't need to change anything
         * If a button is pressed, we need to check if that direction is open and then adjust velocity for that direction
         * If we come to a spot where there are multiple paths available, then we try each direction from the end of the list and otherwise default to the current direction
         * If we bump into a wall though...
         * I recommend we do this the same way as the ghosts
         * That being we watch to see when we cross the center and if the current direction is invalid we set the direction to none
        */
        // Get valid positions around current cell
        const legalMoves = GameBoard.getLegalMoves(currentBoardPos, this.direction);
        const dirs = legalMoves.map(moveInfo => moveInfo.direction);
        // First check to see if we've run into a wall
        if (this._isCornering)
            this.checkCornering(frameNo, currentCanvasPos, currentBoardPos);
        // Check to see if something has changed
        if (this._controller.listUpdatedFlag)
            this._fillControllerCracks(legalMoves, currentCanvasPos, frameNo);
        if (this.recordedBoardPosition.bx !== currentBoardPos.bx || this.recordedBoardPosition.by !== currentBoardPos.by) { // Check if we have moved cells
            this._haveCheckedForWall = false;
            this.recordedBoardPosition = currentBoardPos;
            this._fillControllerCracks(legalMoves, currentCanvasPos, frameNo);
        }
        if (!this._haveCheckedForWall && this.__checkIfAcrossCenter(currentCanvasPos)) { // Check if we can process
            // Now check if our current direction will bump us into that wall
            let okayToMove = dirs.includes(this.direction); //legalMoves.some( move => move.direction === this.direction);
            if (!okayToMove) {
                this.setVelocityVector({ x: 0, y: 0 }, this.direction, frameNo);
                this.setCanvasCoords(frameNo, currentCanvasPos, true, true);
            }
            this._haveCheckedForWall = true;
        }
        return {
            placementCoords: currentCanvasPos,
            sheetCoords: this._imageDeterminer(frameNo),
            enlarge: true
        };
    }
    /**
     * Get pacman to go in the first direction he can given the queue of directions and available directions
     */
    _fillControllerCracks(legalMoves, pos, frameNo) {
        const presses = this._controller.buttonPressList;
        const dirs = legalMoves.map(move => move.direction);
        // No check needed for if list is empty, this will take care of it
        for (let i = presses.length - 1; i >= 0; i--) {
            if (dirs.includes(presses[i])) {
                this.setVelocityVector(vectorFromDirection[presses[i]], presses[i], frameNo); //this._computePossibleCornerVector(this.direction, presses[i])
                if (presses[i] === "left" || presses[i] === "right") {
                    this.setCanvasCoords(frameNo, pos, false, true);
                }
                else {
                    this.setCanvasCoords(frameNo, pos, true, false);
                }
                break;
            }
        }
        // If it didn't match, we don't care. Just continue going. It's why we check for a wall after this
        this._controller.listUpdatedFlag = false;
    }
    checkCornering(frameNo, canvasCoords, boardCoords) {
        switch (this._previousDirection) {
            case "down":
                if (canvasCoords.cy >= this._corneringTarget.cy) {
                    this.updateCanvasCoords(frameNo, false, true);
                    this.setVelocityVector(vectorFromDirection[this.direction], this.direction, frameNo);
                    this._isCornering = false;
                }
                break;
            case "left":
                if ((canvasCoords.cx + 8) % 16 <= 8) {
                    this.updateCanvasCoords(frameNo, true, false);
                    this.setVelocityVector(vectorFromDirection[this.direction], this.direction, frameNo);
                    this._isCornering = false;
                }
                break;
            case "right":
                if ((canvasCoords.cx + 8) % 16 >= 8) {
                    this.updateCanvasCoords(frameNo, true, false);
                    this.setVelocityVector(vectorFromDirection[this.direction], this.direction, frameNo);
                    this._isCornering = false;
                }
                break;
            case "up":
                if ((canvasCoords.cy + 8) % 16 <= 8) {
                    this.updateCanvasCoords(frameNo, false, true);
                    this.setVelocityVector(vectorFromDirection[this.direction], this.direction, frameNo);
                    this._isCornering = false;
                }
        }
    }
    _getCornerVector(prevDir, newDir, targetSpace) {
        if (newDir === "none")
            return { x: 0, y: 0 };
        if (prevDir === "none")
            return vectorFromDirection[newDir];
        if (prevDir === newDir)
            return this.__currentVector;
        // Take care of turning around and standing still
        if (prevDir === "left" && newDir === "right" || prevDir === "up" && newDir === "down" || newDir === "left" && prevDir === "right" || newDir === "up" && prevDir === "down") {
            return vectorFromDirection[newDir];
        }
        let ret = { x: 0, y: 0 };
        let t = DRIVING_SPEED;
        if (prevDir === "right" || newDir === "right")
            ret.x = t;
        else
            ret.x = -t;
        if (prevDir === "down" || newDir === "down")
            ret.y = t;
        else
            ret.y = -t;
        this._isCornering = true;
        this._previousDirection = prevDir;
        this._corneringTarget = {
            cy: targetSpace.by * 16,
            cx: targetSpace.bx * 16
        };
        return ret;
    }
    _imageDeterminer(frameNo) {
        if (this._animationState === "normal") {
            const progression = frameNo - this.__startFrame;
            const indexName = this.__animationInfo[this.direction];
            const animLength = spriteManager[indexName].length;
            const frameNumer = Math.floor(progression / PacMan._CHOMPS_PER_IMAGE) % animLength;
            // return spriteManager.pacStatic[0];
            return spriteManager[indexName][frameNumer];
        }
    }
    setVelocityVector(vector, direction, frameNo) {
        this._previousDirection = this.direction;
        super.setVelocityVector(vector, direction, frameNo);
    }
}
PacMan._CHOMPS_PER_IMAGE = Entity.FRAMES_PER_IMAGE / 2;
export default PacMan;
