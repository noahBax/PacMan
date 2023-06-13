import { Entity } from "../entity.js";
import { spriteManager } from "../spriteManager.js";
import { RenderObject, animationInfo, boardCoordinate, canvasCoordinate, vector } from "../types.js";

class PowerPellet {
	
	// Positions are [6, 1], [6, 26], [26, 1], [26, 26]

	private _position: boardCoordinate;
	private _canvasPos: canvasCoordinate;
	private _isVisible = true;
	private static _animationLocation = "energizer";

	constructor(position: boardCoordinate) {
		this._position = position;
		this._canvasPos = {
			cy: position.by * 16,
			cx: position.bx * 16
		}
	}

	checkIfHit(boardCoord: boardCoordinate) {
		if (this._isVisible && this._position.bx === boardCoord.bx && this._position.by === boardCoord.by) {

			this._isVisible = false;
			return true;
			
		}
	}

	activate() {
		this._isVisible = true;
	}

	updateFrame(frameNo: number): RenderObject {
		if (this._isVisible) {
			return {
				placementCoords: this._canvasPos,
				sheetCoords: spriteManager[PowerPellet._animationLocation],
			}
		}
		
	}
}

export { PowerPellet };