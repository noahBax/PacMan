import { Entity } from "../entity.js";
import { GameBoard } from "../gameBoard.js";
import { spriteManager } from "../spriteManager.js";
import { PacMan } from "./pacman.js";
class Ghost extends Entity {
    constructor(pacmanRef, gameBoard) {
        super();
        this.state = "chase";
        this._frightTimer = 0;
        this._frightStart = 0;
        // Direction that won't be applied until we reach the center of the turningLocation
        this.latentDirection = "right";
        this._moveProcessed = true;
        this.__pacmanReference = pacmanRef;
        this.gameBoard = gameBoard;
    }
    initializeGhost() {
        /**
         * What do we know at this point
         * - We know the start of our vector
         * - Our board position
         * - Our direction
         * - by extension our vector
         */
        var _a;
        // So first let's do finding the path to the target
        this._moveProcessed = false;
        this.knownPreviousBoardLocation = (_a = this.knownCurrentBoardLocation) !== null && _a !== void 0 ? _a : { ...this.__currentBoardLocation };
        this.knownCurrentBoardLocation = { ...this.__currentBoardLocation };
        this.__currentVector = Ghost.getVectorFromDirection(this.direction);
        const forwardPosition = this.__getForwardBoardCoordinate();
        const bestMovedTowardsTarget = this._targetLogic(forwardPosition);
        // Above also sets the knownTargetLocation variable
        this.latentDirection = bestMovedTowardsTarget.direction;
        this.__turningLocation = bestMovedTowardsTarget.coord;
    }
    setInitial(coords, vector, currFrame) {
        super.setInitial(coords, vector, currFrame);
        this.initializeGhost();
    }
    updateFrame(frameNo) {
        var _a, _b;
        const progress = frameNo - this.__startTime;
        // * Update frightened timer
        if (this.state == "frightened") {
            if (frameNo - this._frightStart >= this._frightTimer) {
                this.state = "chase";
            }
        }
        // Get current position on gameboard
        const currentCanvasPos = GameBoard.correctForPurgatory(this.getCurrentPosition(frameNo));
        // Correct the coordinate for purgatory
        // Create a copy and modify a copy of these so we can find our center in the next function
        const currentBoardPos = GameBoard.getPositionOnBoardGrid({
            cy: currentCanvasPos.cy + 8,
            cx: currentCanvasPos.cx + 8
        });
        /**
         * What to do if we're in purgatory
         *  - Teleport to the other side of the map
         * 	  - Change __startPositionForvector
         * 	- Update associated coordinates (presumably by calling initialize)
         */
        console.log("	Direction is", this.direction, ". Latent direction is", this.latentDirection);
        console.log("	Board position is", currentBoardPos, "and actual is", currentCanvasPos);
        if (this.latentDirection === "none")
            throw ("ahhhh");
        /**
         * Check to see if we are in a different tile than previously recorded
         * (We don't have to if the move we are waiting to do hasn't processed)
         * If we have we need to
         * 	- Update the recorded tile
         *  - Adjust
         * 	  - knownPreviousBoardLocation
         * 	  - knownCurrentBoardLocation
         * 	  - __currentBoardLocation
         *  - Find out what the best way to get to the target tile is
         *  - Adjust
         *    - latentDirection
         *    - __turningLocation
         * Lastly we need to mark the move as unprocessed
         */
        if (this._moveProcessed && this.__currentBoardLocation.bx !== currentBoardPos.bx || this.__currentBoardLocation.by !== currentBoardPos.by) {
            console.log("	We have moved");
            this.knownPreviousBoardLocation = { ...this.__currentBoardLocation };
            this.__currentBoardLocation = { ...currentBoardPos };
            this.knownCurrentBoardLocation = { ...currentBoardPos };
            console.log("	Location Previously", this.knownPreviousBoardLocation, "Current Location", this.knownCurrentBoardLocation);
            const bestPossibleMove = this._targetLogic(this.__turningLocation);
            console.log("	Target block", this.knownTargetLocation, "Move to", bestPossibleMove);
            this.latentDirection = (_a = bestPossibleMove === null || bestPossibleMove === void 0 ? void 0 : bestPossibleMove.direction) !== null && _a !== void 0 ? _a : "none";
            this.__turningLocation = (_b = bestPossibleMove === null || bestPossibleMove === void 0 ? void 0 : bestPossibleMove.coord) !== null && _b !== void 0 ? _b : { ...this.knownCurrentBoardLocation };
            this._moveProcessed = false;
        }
        /**
         * Check to see if we are at a point we can apply our latent move at
         * (Don't have to check if the move has already been processed)
         *
         * We first check to see if we are in the correct square by looking at turningLocation and currentBoardPos
         * Next check to see if we are past the middle point
         * If we are, we can
         *  - Apply the latent direction
         *  - Adjust
         *    - __startPositionForVector
         *    - __currentVector
         * 	  - direction
         *    - __startTime
         * Mark the move as processed
         */
        if (!this._moveProcessed && (currentBoardPos.bx === this.__turningLocation.bx || currentBoardPos.by === this.__turningLocation.by)) {
            console.log("	Checking if can apply latent move. Direction is", this.direction, ". Latent direction is", this.latentDirection);
            let canProcessNow = false;
            // * These are reversed comparisons because it is the same thing as adding 8 to the canvas position to center it
            // * Save cpu time right? Sacrifice readability
            switch (this.direction) {
                case "up":
                    canProcessNow = currentCanvasPos.cy % 16 >= 8;
                    break;
                case "down":
                    canProcessNow = currentCanvasPos.cy % 16 < 8;
                    break;
                case "left":
                    canProcessNow = currentCanvasPos.cx % 16 >= 8;
                    break;
                case "right":
                    canProcessNow = currentCanvasPos.cx % 16 < 8;
                    break;
                case "none":
                    canProcessNow = true;
                    throw ("updateFrame: Direction is none, can't process");
                    break;
            }
            if (canProcessNow) {
                console.log("	We can apply the latent move");
                this.__startPositionForVector = { ...currentCanvasPos };
                this.__currentVector = Ghost.getVectorFromDirection(this.latentDirection);
                this.direction = this.latentDirection;
                this.__startTime = frameNo;
                this._moveProcessed = true;
                // ToDo: Ideally I want to have the Ghost's eyes facing in the direction they want to turn before it is decided. So I may have things start looking at the latent direction
            }
        }
        /**
         * Do a purgatory check here to teleport us to the correct side
         */
        GameBoard.purgatoryCheck(frameNo, this);
        /**
         * Return coordinates with respect to canvas
         * This'll always happen
         */
        return {
            placementCoords: currentCanvasPos,
            sheetCoords: this._imageDeterminer(frameNo)
        };
    }
    _targetLogic(forwardPosition) {
        // Do target Logic
        const currTarget = this.getTarget();
        this.knownTargetLocation = { ...currTarget };
        console.log("	Position moving forward", forwardPosition);
        const legalMoves = GameBoard.getLegalMoves(forwardPosition, this.direction);
        console.log("	Legal moves around it are", legalMoves);
        // Literally an implementation of greedy best first search
        let bestDistance = Infinity;
        let bestMove;
        console.log("	Position is", this.__currentBoardLocation);
        legalMoves.forEach(move => {
            console.log("	looking at possible move", move);
            // Check to see if this is the square being ocupied
            if (!(move.coord.bx === this.__currentBoardLocation.bx && move.coord.by === this.__currentBoardLocation.by)) {
                console.log("	Not our current yay");
                const distance = (currTarget.bx - move.coord.bx) ** 2 + (currTarget.by - move.coord.by) ** 2;
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestMove = move;
                }
            }
        });
        console.log("	Best move toward target is", bestMove);
        return bestMove;
    }
    scareMe(frameTimer, currFrame) {
        this.state = "frightened";
        this._frightStart = currFrame;
        this._frightTimer = frameTimer;
    }
    _imageDeterminer(frameNo) {
        if (this.state === "frightened") {
            const frightProgression = frameNo - this._frightStart;
            const indexName = (this._frightTimer - frightProgression <= 120) ? "ghostSkeptical" : "ghostFrightened";
            const animLength = spriteManager[indexName].length;
            const frameNumer = Math.floor(frightProgression / Entity._FRAMES_PER_IMAGE) % animLength;
            return spriteManager[indexName][frameNumer];
        }
        else if (this.state === "eyes") {
            const progression = frameNo - this.__startTime;
            const indexName = "eyes";
            const animLength = spriteManager[indexName].length;
            const frameNumer = Math.floor(progression / Entity._FRAMES_PER_IMAGE) % animLength;
        }
        else {
            const progression = frameNo - this.__startTime;
            const indexName = this.__animationInfo[this.direction];
            const animLength = spriteManager[indexName].length;
            const frameNumer = Math.floor(progression / Entity._FRAMES_PER_IMAGE) % animLength;
            return spriteManager[indexName][frameNumer];
        }
    }
    __getForwardBoardCoordinate() {
        let returnBoardPos = { ...this.__currentBoardLocation };
        console.log("	Current direction", this.direction);
        switch (this.direction) {
            case "left":
                if (GameBoard.isInPurgatory(this))
                    return { by: 17, bx: 27 };
                returnBoardPos.bx -= 1;
                return returnBoardPos;
            case "right":
                if (GameBoard.isInPurgatory(this))
                    return { by: 17, bx: 0 };
                returnBoardPos.bx += 1;
                return returnBoardPos;
            case "down":
                returnBoardPos.by += 1;
                return returnBoardPos;
            case "up":
                returnBoardPos.by -= 1;
                return returnBoardPos;
            default:
                // If for whatever reason we ain't moving, set to right
                return { bx: 0, by: 0 };
        }
    }
    static getVectorFromDirection(direction) {
        switch (direction) {
            case "up":
                return { x: 0, y: -PacMan.SPEED };
                break;
            case "down":
                return { x: 0, y: PacMan.SPEED };
                break;
            case "left":
                return { x: -PacMan.SPEED, y: 0 };
                break;
            case "right":
                return { x: PacMan.SPEED, y: 0 };
                break;
            default:
                return { x: 0, y: 0 };
        }
    }
}
export { Ghost };
