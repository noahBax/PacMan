import spriteManager from "../spriteManager.js";
class PowerPellet {
    constructor(position) {
        this._isVisible = true;
        this._position = position;
        this._canvasPos = {
            cy: position.by * 16,
            cx: position.bx * 16
        };
    }
    checkIfHit(boardCoord) {
        if (this._isVisible && this._position.bx === boardCoord.bx && this._position.by === boardCoord.by) {
            this._isVisible = false;
            return true;
        }
    }
    activate() {
        this._isVisible = true;
    }
    updateFrame(frameNo) {
        if (this._isVisible) {
            return {
                placementCoords: this._canvasPos,
                sheetCoords: spriteManager[PowerPellet._animationLocation],
            };
        }
    }
}
PowerPellet._animationLocation = "energizer";
export default PowerPellet;
