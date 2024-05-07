import DevMode from "./devmode.js";
import LOG_FLAG from "./logTools.js";
import { GhostIDs } from "./types.js";

/**
 * The goal of the monster pen is to manage how and when the ghosts get
 * released from the pen. 
 */

export const ghostsExiting: GhostIDs[] = [];

class MonsterPen {

	// These are the starting occupants
	private _penOccupants: GhostIDs[] = [GhostIDs.PINKY, GhostIDs.INKY, GhostIDs.CLYDE];

	private _inkyCounter = 0;
	private _clydeCounter = 0;

	private _timeLastEaten = 0;

	constructor(timeStamp: number) {
		this._timeLastEaten = timeStamp;
	}

	evictOccupants(timeStamp: number) {

		if (this._penOccupants.length == 0)
			return;

		for (let i = this._penOccupants.length - 1; i > -1; i--) {
			switch (this._penOccupants[i]) {
				case GhostIDs.BLINKY:
				case GhostIDs.PINKY:
					ghostsExiting.push(this._penOccupants[i]);
					this._penOccupants.splice(i, 1);
					break;
				case GhostIDs.INKY:
					// This changes with level obviously, but not implemented right now
					if (this._inkyCounter >= 30) {
						ghostsExiting.push(GhostIDs.INKY);
						this._penOccupants.splice(i, 1);
					}
					break;
				case GhostIDs.CLYDE:
					// This changes with level obviously, but not implemented right now
					if (this._clydeCounter >= 60) {
						ghostsExiting.push(GhostIDs.CLYDE);
						this._penOccupants.splice(i, 1);
					}
					break;
			}
		}
		
		if (timeStamp - this._timeLastEaten > 4000) {

			// Evict in order of priority
			this._penOccupants.sort( (b, c) => c - b);
			const evictMe = this._penOccupants.pop();

			ghostsExiting.push(evictMe);
			this._timeLastEaten = timeStamp;
			
		}

		if (DevMode.IN_DEV_MODE) {
			window.developer.updatePenInfo(this._penOccupants);
		}
		
	}

	signalExited(ghost: GhostIDs) {
		const ghostIndex = ghostsExiting.indexOf(ghost);

		if (ghostIndex == -1) {
			console.log(LOG_FLAG.MONSTER_PEN, `Ghost ${ghost} tried to exited the pen when it wasn't in the queue`);
			return false;
		}

		ghostsExiting.splice(ghostIndex, 1);
	}

	dotEaten(timeStamp: number) {
		this._timeLastEaten = timeStamp;

		if (this._penOccupants.indexOf(GhostIDs.INKY) != -1) {
			this._inkyCounter++;	
		} else if (this._penOccupants.indexOf(GhostIDs.CLYDE) != -1) {
			this._clydeCounter++;
		}
	}
}

export default MonsterPen;