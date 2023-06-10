import { Entity } from "../entity.js";
import { GameBoard } from "../gameBoard.js";
import { unpackCoords } from "../index.js";
import { spriteManager } from "../spriteManager.js";
class Ghost extends Entity {
    constructor(pacmanRef, gameBoard) {
        super();
        // Items that update singly or paired.
        this.__state = "chase";
        this._frightTimer = 0;
        this._frightStart = 0;
        this._moveProcessed = true;
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
        // * Update frightened timer
        if (this.__state == "frightened") {
            if (frameNo - this._frightStart >= this._frightTimer) {
                this.__state = "chase";
            }
        }
        // Get current position on gameboard
        let currentCanvasPos = this.getCanvasCoords(frameNo);
        // Get the cell our center is in
        let currentBoardPos = this.getBoardCoordinatesCentered(frameNo);
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
        console.log(`	%cPrevious location is,%c${unpackCoords(this.recordedBoardLocation)}`, 'color: #bada55;', 'color: #FFD700');
        if (this.__latentMoveInformation.direction === "none")
            throw ("ahhhh");
        /**
         * Do a purgatory check here to teleport us to the correct side
         */
        if (GameBoard.correctForPurgatory(this, currentCanvasPos, frameNo)) {
            currentCanvasPos = this.getCanvasCoords(frameNo);
            currentBoardPos = this.getBoardCoordinatesCentered(frameNo);
            // this._moveProcessed = false;
            console.log("	%cMarking move as not processed", 'color: #1111FF;');
            console.log("	%cPergatory adjusted coordinates are", unpackCoords(currentCanvasPos), 'color: #1111FF');
            console.groupEnd();
        }
        // Check if we have moved
        if (this.recordedBoardLocation.bx !== currentBoardPos.bx || this.recordedBoardLocation.by !== currentBoardPos.by) {
            console.group(`	%cWe have moved from ${unpackCoords(this.recordedBoardLocation)} to ${unpackCoords(currentBoardPos)}`, 'color: #FFA500');
            // Calculate the new target coord
            this.targetCoord = this.getTarget(frameNo);
            console.log(`	%cUpdated target location is ${unpackCoords(this.targetCoord)}`, 'color: #FFA500');
            // Update latent information before assigning previous
            // Or we can just save it beforehand
            this.__latentMoveInformation = this._askTargetLogic();
            // Now we need to wait until we can actually apply the latent information
            this._moveProcessed = false;
            // Now update previous
            this.recordedBoardLocation = currentBoardPos;
            console.log(`	New latent move information is`, this.__latentMoveInformation);
            console.groupEnd();
        }
        else if (!this._moveProcessed && currentBoardPos.bx === this.__latentMoveInformation.baseCoordinate.bx && currentBoardPos.by === this.__latentMoveInformation.baseCoordinate.by) {
            if (this.__checkIfAcrossCenter(currentCanvasPos)) {
                console.group("	%cWe can apply the latent move", 'color: #00ff00');
                console.log(`	%cUnchanged direction is %c${this.direction}`, 'color: #00ff00;', 'color: #FFD700;');
                this.setVelocityVector(Ghost.vectorFromDirection[this.__latentMoveInformation.direction], this.__latentMoveInformation.direction, frameNo);
                console.log(`	%cAdjusted direction is %c${this.direction}`, 'color: #00ff00;', 'color: #ffd700;');
                this.setCanvasCoords(frameNo, currentCanvasPos, true, false);
                this._moveProcessed = true;
                // Update canvas coords
                currentCanvasPos = this.getCanvasCoords(frameNo);
                // ToDo: Ideally I want to have the Ghost's eyes facing in the direction they want to turn before it is decided. So I may have things start looking at the latent direction
                console.groupEnd();
            }
        }
        /**
         * Return coordinates with respect to canvas
         * This'll always happen
         */
        return {
            placementCoords: currentCanvasPos,
            sheetCoords: this._imageDeterminer(frameNo)
        };
    }
    _askTargetLogic() {
        const legalMoves = GameBoard.getLegalMoves(this.__latentMoveInformation.coord, this.direction);
        console.log("	Legal moves around it are", legalMoves);
        // Literally an implementation of greedy best first search
        let bestDistance = Infinity;
        let bestMove;
        legalMoves.forEach(move => {
            console.log("	looking at possible move", move);
            // Check to see if this is the square being ocupied
            if (!(move.coord.bx === this.recordedBoardLocation.bx && move.coord.by === this.recordedBoardLocation.by)) {
                console.log("	Not our previous yay");
                const distance = (this.targetCoord.bx - move.coord.bx) ** 2 + (this.targetCoord.by - move.coord.by) ** 2;
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
        this.__state = "frightened";
        this._frightStart = currFrame;
        this._frightTimer = frameTimer;
    }
    _imageDeterminer(frameNo) {
        if (this.__state === "frightened") {
            const frightProgression = frameNo - this._frightStart;
            const indexName = (this._frightTimer - frightProgression <= 120) ? "ghostSkeptical" : "ghostFrightened";
            const animLength = spriteManager[indexName].length;
            const frameNumer = Math.floor(frightProgression / Entity._FRAMES_PER_IMAGE) % animLength;
            return spriteManager[indexName][frameNumer];
        }
        else if (this.__state === "eyes") {
            const progression = frameNo - this.__startFrame;
            const indexName = "eyes";
            const animLength = spriteManager[indexName].length;
            const frameNumer = Math.floor(progression / Entity._FRAMES_PER_IMAGE) % animLength;
        }
        else {
            const progression = frameNo - this.__startFrame;
            const indexName = this.__animationInfo[this.__latentMoveInformation.direction];
            const animLength = spriteManager[indexName].length;
            const frameNumer = Math.floor(progression / Entity._FRAMES_PER_IMAGE) % animLength;
            return spriteManager[indexName][frameNumer];
        }
    }
}
export { Ghost };
