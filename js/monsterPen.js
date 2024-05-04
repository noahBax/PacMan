import LOG_FLAG from "./logTools.js";
import { GhostIDs } from "./types.js";
/**
 * The goal of the monster pen is to manage how and when the ghosts get
 * released from the pen.
 */
export const ghostsExiting = [];
class MonsterPen {
    constructor() {
        this._penOccupants = [];
        this.releasingGhost = false;
        this._inkyCounter = 0;
        this._clydeCounter = 0;
        this._timeLastEaten = 0;
    }
    evictOccupants(timeStamp) {
        if (this._penOccupants.length == 0)
            return;
        for (let i = this._penOccupants.length - 1; i != 0; i--) {
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
        if (this._timeLastEaten > 4000) {
            // Evict in order of priority
            this._penOccupants.sort((b, c) => c - b);
            const evictMe = this._penOccupants.pop();
            ghostsExiting.push(evictMe);
            this._timeLastEaten = timeStamp;
        }
    }
    signalExited(ghost) {
        const ghostIndex = ghostsExiting.indexOf(ghost);
        if (ghostIndex == -1) {
            console.log(LOG_FLAG.MONSTER_PEN, `Ghost ${ghost} tried to exited the pen when it wasn't in the queue`);
            return false;
        }
        this._penOccupants.splice(ghostIndex, 1);
    }
    dotEaten(timeStamp) {
        this._timeLastEaten = timeStamp;
        if (this._penOccupants.indexOf(GhostIDs.INKY) != -1) {
            this._inkyCounter++;
        }
        else if (this._penOccupants.indexOf(GhostIDs.CLYDE) != -1) {
            this._clydeCounter++;
        }
    }
}
export default MonsterPen;
