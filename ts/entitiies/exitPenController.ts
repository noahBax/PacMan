import { Direction, boardCoordinate, canvasCoordinate, vector } from "../types.js";
import { penVectorFromDirection, vectorFromDirection } from "../utilities.js";

export enum LAST_FLAG {
	NOT_IN_PEN,
	TOWARDS_CENTER,
	HEADING_UP,
	EXITED_TOP
}

class ExitPenController {

	lastFlag: LAST_FLAG = LAST_FLAG.NOT_IN_PEN;
	direction: Direction = "down";
	vector: vector = { x: 0, y: 0 };

	updateDirection(boardPosition: boardCoordinate, canvasPosition: canvasCoordinate) {

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
			this.direction == "right" && boardPosition.bx > 13)
		) {
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

	startExitingPen(boardPosition: boardCoordinate) {

		this.lastFlag = LAST_FLAG.TOWARDS_CENTER;

		if (boardPosition.bx < 14) {
			this.direction = "right";
			this.vector = penVectorFromDirection["right"];
		} else if (boardPosition.bx > 14) {
			this.direction = "left";
			this.vector = penVectorFromDirection["left"];
		} else {
			this.vector = penVectorFromDirection["up"];
			this.direction = "up";
			this.lastFlag = LAST_FLAG.HEADING_UP;
		}
	}
}

export default ExitPenController;