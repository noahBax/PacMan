import GameBoard from "./gameBoard.js";
class Entity {
    constructor() {
        this._hasBoardCoordCacheGenerated = -1;
        this._hasCenteredBoardCoordCacheGenerated = -1;
        this.__startFrame = 0;
        this.direction = "right";
        // static vectorFromDirection(direction: Direction): vector {
        // 	switch (direction) {
        // 		case "up":
        // 			return {x: 0, y: -Controller.DRIVING_SPEED}
        // 			break;
        // 		case "down":
        // 			return {x: 0, y: Controller.DRIVING_SPEED}
        // 			break;
        // 		case "left":
        // 			return {x: -Controller.DRIVING_SPEED, y: 0}
        // 			break;
        // 		case "right":
        // 			return {x: Controller.DRIVING_SPEED, y: 0}
        // 			break;
        // 		default:
        // 			return {x: 0, y: 0}
        // 	}
        // }
    }
    /**
     * Compute board coordinates as well as updates
     * cached board coordiantes if needed
     * @param frameNo Frame number
     * @returns board coordinates of the entity
     */
    getBoardCoordinates(frameNo) {
        if (this._hasBoardCoordCacheGenerated === frameNo)
            return this._boardCoordCache;
        // else we need to compute it and cache it
        let coords = this.getCanvasCoords(frameNo);
        this._boardCoordCache = {
            by: Math.floor((coords.cy) / GameBoard.actualHeight * GameBoard.height),
            bx: Math.floor((coords.cx) / GameBoard.actualWidth * GameBoard.width),
        };
        this._hasBoardCoordCacheGenerated = frameNo;
        return this._boardCoordCache;
    }
    getBoardCoordinatesCentered(frameNo) {
        if (this._hasCenteredBoardCoordCacheGenerated === frameNo)
            return this._boardCoordCenteredCache;
        let coords = this.getCanvasCoords(frameNo);
        this._boardCoordCenteredCache = {
            by: Math.floor((coords.cy + 8) / GameBoard.actualHeight * GameBoard.height),
            bx: Math.floor((coords.cx + 8) / GameBoard.actualWidth * GameBoard.width),
        };
        this._hasCenteredBoardCoordCacheGenerated = frameNo;
        return this._boardCoordCenteredCache;
    }
    /**
     * Set the Velociraptor.
     * Updates the protected vector and public direction
     * @param vector Vector value
     * @param direction Direction describing movement
     */
    setVelocityVector(vector, direction, frameNo) {
        this.__currentVector = vector;
        this.direction = direction;
        this.__startFrame = frameNo;
    }
    /**
     * Position is just calculated by frames passed multiplied by the velocity vector
     */
    getCanvasCoords(frameNo) {
        const delta = frameNo - this.__startFrame;
        // console.log(delta);
        return {
            cx: (this.__startPositionForVector.cx + this.__currentVector.x * delta),
            cy: (this.__startPositionForVector.cy + this.__currentVector.y * delta),
        };
    }
    __checkIfAcrossCenter(pos) {
        // * These are reversed comparisons because the math is the same thing as adding 8 to the canvas position to center it
        switch (this.direction) {
            case "up":
                return pos.cy % 16 > 8;
            case "down":
                return pos.cy % 16 < 8;
            case "left":
                return pos.cx % 16 > 8;
            case "right":
                return pos.cx % 16 < 8;
            case "none":
                return false;
        }
    }
    /**
     * Set the canvas coordinates of the entity.
     * @param frameNo Current frame number
     * @param newCoords New coordinates
     */
    setCanvasCoords(frameNo, newCoords, roundX = false, roundY = false) {
        if (roundX)
            newCoords.cx = Math.round(newCoords.cx / 16) * 16;
        if (roundY)
            newCoords.cy = Math.round(newCoords.cy / 16) * 16;
        this.__startPositionForVector = newCoords;
        this.__startFrame = frameNo;
    }
    /**
     * Updates the canvas coords to where they are currently.
     * Just calls `setCanvasCoords` with the current position.
     * @param frameNo Current frame number
     */
    updateCanvasCoords(frameNo, roundX = false, roundY = false) {
        this.setCanvasCoords(frameNo, this.getCanvasCoords(frameNo), roundX, roundY);
    }
    purgatoryCheck(frameNo) {
        const currentCanvasPos = this.getCanvasCoords(frameNo);
        GameBoard.correctForPurgatory(this, currentCanvasPos, frameNo);
    }
}
Entity.FRAMES_PER_IMAGE = 128;
export default Entity;
