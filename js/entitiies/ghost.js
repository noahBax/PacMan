import { Entity } from "../entity.js";
import { GameBoard } from "../gameBoard.js";
import { unpackCoords } from "../index.js";
import { spriteManager } from "../spriteManager.js";
import { penVectorFromDirection, vectorFromDirection } from "../utilities.js";
class Ghost extends Entity {
    constructor(pacmanRef, gameBoard) {
        super();
        // Items that update singly or paired.
        this.__state = "chase";
        this._frightTimer = 0;
        this._frightStart = 0;
        this._moveProcessed = true;
        /**
         * 0: in pen, wandering
         * 1: pen has directed us to move out
         * 2: active in the maze as normal
         */
        this.monsterPenState = 0;
        this.__pacmanReference = pacmanRef;
        this.GAME_BOARD = gameBoard;
    }
    setCanvasCoords(frameNo, newCoords, roundToBoard = false, updateLatentInformation = false, shouldUpdateTarget = false) {
        this._moveProcessed = true;
        // Do this before assigning previous
        if (updateLatentInformation)
            this.__latentMoveInformation = this._askTargetLogic(); //, this.getBoardCoordinatesCentered(frameNo));
        // this.previousBoardLocation = this.getBoardCoordinatesCentered(frameNo);		
        if (shouldUpdateTarget)
            this.targetCoord = this.getTarget(frameNo);
        if (roundToBoard) {
            super.setCanvasCoords(frameNo, newCoords, true, true);
        }
        else {
            super.setCanvasCoords(frameNo, newCoords);
        }
    }
    updateFrame(frameNo) {
        // ToDo: Do turn-around on mode switch
        // Update frightened timer
        if (this.__state == "frightened") {
            if (frameNo - this._frightStart >= this._frightTimer) {
                this.__state = "chase";
                this.setVelocityVector(vectorFromDirection[this.__latentMoveInformation.direction], this.__latentMoveInformation.direction, frameNo);
            }
        }
        /**
         * Do a purgatory check here to teleport us to the correct side
         */
        this.purgatoryCheck(frameNo);
        // Get current position on game board
        let currentCanvasPos = this.getCanvasCoords(frameNo);
        // Get the cell our center is in
        let currentBoardPos = this.getBoardCoordinatesCentered(frameNo);
        // this.logDebugInformation(currentBoardPos, currentCanvasPos);
        switch (this.monsterPenState) {
            case 0: // In the pen and wandering. We can literally only go up or down
                // Oscillate around the y = 17 mark
                if (this.direction == "up" && currentBoardPos.by < 17) {
                    this.updateCanvasCoords(frameNo);
                    this.setVelocityVector(penVectorFromDirection["down"], "down", frameNo);
                }
                else if (this.direction == "down" && currentBoardPos.by > 17) {
                    this.updateCanvasCoords(frameNo);
                    this.setVelocityVector(penVectorFromDirection["up"], "up", frameNo);
                }
                break;
            case 1: // Move to the center of the pen then move up
                // Bit of an oddly specific scenario actually. We're moving
                // towards the middle of two blocks
                if (this.direction == "left" && currentBoardPos.bx < 14 || this.direction == "right" && currentBoardPos.bx > 13) {
                    // Snap to the center and start moving up
                    this.setCanvasCoords(frameNo, { cx: 13 * 16 + 8, cy: currentCanvasPos.cy });
                    this.setVelocityVector(penVectorFromDirection["up"], "up", frameNo);
                }
                else if (this.direction == "up" && currentCanvasPos.cy == 14) {
                    this.setVelocityVector(vectorFromDirection["left"], "left", frameNo);
                    this.setCanvasCoords(frameNo, { cx: 13 * 16 + 8, cy: 13 * 16 });
                    // We can appropriately transition to state 2
                    this.monsterPenState = 2;
                }
                break;
            case 2:
                // Check if we have moved
                if (currentBoardPos.bx === this.__latentMoveInformation.coord.bx && currentBoardPos.by === this.__latentMoveInformation.coord.by) {
                    // console.group(`	%cWe have moved from ${unpackCoords(this.recordedBoardPosition)} to ${unpackCoords(currentBoardPos)}`, 'color: #FFA500');
                    // Calculate the new target coord
                    this.targetCoord = this.getTarget(frameNo);
                    // console.log(`	%cUpdated target location is ${unpackCoords(this.targetCoord)}`, 'color: #FFA500');
                    // Update latent information before assigning previous
                    this.__latentMoveInformation = this._askTargetLogic();
                    // Now we need to wait until we can actually apply the latent information
                    this._moveProcessed = false;
                    // Now update previous
                    this.recordedBoardPosition = currentBoardPos;
                    // console.log(`	New latent move information is`, this.__latentMoveInformation);
                    console.groupEnd();
                }
                else if (!this._moveProcessed && currentBoardPos.bx === this.__latentMoveInformation.baseCoordinate.bx && currentBoardPos.by === this.__latentMoveInformation.baseCoordinate.by) {
                    if (this.__checkIfAcrossCenter(currentCanvasPos)) {
                        // console.group("	%cWe can apply the latent move", 'color: #00ff00');
                        // console.log(`	%cUnchanged direction is %c${this.direction}`, 'color: #00ff00;', 'color: #FFD700;')
                        this.setVelocityVector(vectorFromDirection[this.__latentMoveInformation.direction], this.__latentMoveInformation.direction, frameNo);
                        // console.log(`	%cAdjusted direction is %c${this.direction}`, 'color: #00ff00;', 'color: #ffd700;');
                        this.setCanvasCoords(frameNo, currentCanvasPos, true, false);
                        this._moveProcessed = true;
                        // Update canvas coords
                        currentCanvasPos = this.getCanvasCoords(frameNo);
                        // ToDo: Ideally I want to have the Ghost's eyes facing in the direction they want to turn before it is decided. So I may have things start looking at the latent direction
                        console.groupEnd();
                    }
                }
                break;
        }
        /**
         * Return coordinates with respect to canvas
         * This'll always happen
         */
        return {
            placementCoords: currentCanvasPos,
            sheetCoords: this._imageDeterminer(frameNo),
            enlarge: true
        };
    }
    _askTargetLogic() {
        const legalMoves = GameBoard.getLegalMoves(this.__latentMoveInformation.coord, this.direction, true);
        // console.log("	Legal moves around it are", legalMoves);
        if (this.__state === "frightened") {
            // Generate a random number to decide which direction we try first 
            let alternatives = ["right", "down", "left", "up"];
            let preferredDir = alternatives[Math.floor(Math.random() * 4)];
            legalMoves.sort((a, b) => {
                return alternatives.indexOf(a.direction) - alternatives.indexOf(b.direction);
            });
            // console.log("	Preferred random direction is", preferredDir);
            // If that first direction doesn't work out, order of preference is up, left, down, right
            // We work backwards up that list so that if we find the preferred direction we can take that way first 
            let ret;
            // console.log(legalMoves);
            for (let i = 0; i < legalMoves.length; i++) {
                if ((legalMoves[i].coord.bx === this.recordedBoardPosition.bx && legalMoves[i].coord.by === this.recordedBoardPosition.by))
                    continue;
                ret = legalMoves[i];
                if (ret.direction === preferredDir)
                    return ret;
            }
            return ret;
        }
        else {
            // Literally an implementation of greedy best first search
            let bestDistance = Infinity;
            let bestMove;
            legalMoves.forEach(move => {
                // console.log("	looking at possible move", move);
                // Check to see if this is the square being ocupied
                if (!(move.coord.bx === this.recordedBoardPosition.bx && move.coord.by === this.recordedBoardPosition.by)) {
                    // console.log("	Not our previous yay");
                    const distance = (this.targetCoord.bx - move.coord.bx) ** 2 + (this.targetCoord.by - move.coord.by) ** 2;
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        bestMove = move;
                    }
                }
            });
            // console.log("	Best move toward target is", bestMove);
            return bestMove;
        }
    }
    /**
     * Put the ghost into frightened mode for `timer` ms
     * @param timer Time in ms
     * @param timestamp Start time
     */
    scareMe(timer, timestamp) {
        this.__state = "frightened";
        this._frightStart = timestamp;
        this._frightTimer = timer;
    }
    _imageDeterminer(frameNo) {
        if (this.__state === "frightened") {
            const frightProgression = frameNo - this._frightStart;
            const indexName = (this._frightTimer - frightProgression <= 2000) ? "ghostSkeptical" : "ghostFrightened";
            const animLength = spriteManager[indexName].length;
            const frameNumber = Math.floor(frightProgression / Entity.FRAMES_PER_IMAGE) % animLength;
            return spriteManager[indexName][frameNumber];
        }
        else if (this.__state === "eyes") {
            const progression = frameNo - this.__startFrame;
            const indexName = "eyes";
            const animLength = spriteManager[indexName].length;
            const frameNumber = Math.floor(progression / Entity.FRAMES_PER_IMAGE) % animLength;
        }
        else {
            const progression = frameNo - this.__startFrame;
            const indexName = this.__animationInfo[this.__latentMoveInformation.direction];
            const animLength = spriteManager[indexName].length;
            const frameNumber = Math.floor(progression / Entity.FRAMES_PER_IMAGE) % animLength;
            return spriteManager[indexName][frameNumber];
        }
    }
    logDebugInformation(currentBoardPos, currentCanvasPos) {
        if (this._moveProcessed) {
            console.log("	Move has been PROCESSED");
        }
        else {
            console.log("	Move has NOT been PROCESSED");
        }
        console.log(`	%cDirection is %c${this.direction}%c. Latent direction is %c${this.__latentMoveInformation.direction}`, 'color: #bada55;', 'color: #FFD700;', 'color: #bada55;', 'color: #FFD700;');
        console.log(`	%cBoard position is %c${unpackCoords(currentBoardPos)}%c, and actual is %c${unpackCoords(currentCanvasPos)}`, 'color: #bada55;', 'color: #FFD700;', 'color: #bada55;', 'color: #FFD700;');
        console.log(`	%cTurning cell is %c${unpackCoords(this.__latentMoveInformation.baseCoordinate)}`, 'color: #bada55', 'color: #FFD700;');
        console.log(`	%cLatent cell is %c${unpackCoords(this.__latentMoveInformation.coord)}`, 'color: #bada55;', 'color: #FFD700;');
        console.log(`	%cPrevious location is,%c${unpackCoords(this.recordedBoardPosition)}`, 'color: #bada55;', 'color: #FFD700');
        if (this.__latentMoveInformation.direction === "none")
            throw ("ahhhh");
    }
}
export { Ghost };
